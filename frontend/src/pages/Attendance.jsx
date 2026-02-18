import { useState, useEffect } from "react";
import {
    getEmployees,
    getAttendance,
    markAttendanceBulk,
    getAttendanceSummary,
} from "../api";

export default function Attendance() {
    // ── state ──────────────────────────────────────
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // daily marking
    const [markDate, setMarkDate] = useState(todayStr());
    const [statuses, setStatuses] = useState({});
    const [saving, setSaving] = useState(false);

    // history
    const [historyEmpId, setHistoryEmpId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    // active tab
    const [tab, setTab] = useState("mark"); // "mark" | "history"

    function todayStr() {
        return new Date().toISOString().split("T")[0];
    }

    // ── load employees + existing statuses for selected date ──
    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([getEmployees(), getAttendance({ date: markDate })])
            .then(([emps, recs]) => {
                setEmployees(emps);
                const map = {};
                recs.forEach((r) => (map[r.employee_id] = r.status));
                setStatuses(map);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [markDate]);

    // ── bulk save ──────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const records = employees.map((emp) => ({
                employee_id: emp.employee_id,
                status: statuses[emp.employee_id] || "Absent",
            }));
            await markAttendanceBulk({ date: markDate, records });
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    // ── fetch history ──────────────────────────────
    const fetchHistory = async () => {
        setHistoryLoading(true);
        setSummary(null);
        try {
            const params = {};
            if (historyEmpId) params.employee_id = historyEmpId;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            const recs = await getAttendance(params);
            setHistory(recs);

            if (historyEmpId) {
                const s = await getAttendanceSummary(historyEmpId);
                setSummary(s);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setHistoryLoading(false);
        }
    };

    // ── render ─────────────────────────────────────
    return (
        <div className="attendance-page">
            <h1 className="page-title">Attendance</h1>
            <p className="page-subtitle">Track daily attendance and view history</p>

            {/* ── Tabs ──────────────────────────────── */}
            <div className="tabs">
                <button
                    className={`tab ${tab === "mark" ? "tab--active" : ""}`}
                    onClick={() => setTab("mark")}
                >
                    📋 Daily Marking
                </button>
                <button
                    className={`tab ${tab === "history" ? "tab--active" : ""}`}
                    onClick={() => setTab("history")}
                >
                    📜 History
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠</span> {error}
                </div>
            )}

            {/* ══════════ Tab: Daily Marking ══════════ */}
            {tab === "mark" && (
                <div className="card">
                    <div className="card__header">
                        <h2 className="card__title">Mark Attendance</h2>
                        <input
                            type="date"
                            className="input--date"
                            value={markDate}
                            onChange={(e) => setMarkDate(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="page-loader">
                            <div className="spinner" />
                            <p>Loading…</p>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-state__icon">👤</span>
                            <p>No employees found. Add employees first.</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Employee ID</th>
                                            <th>Name</th>
                                            <th>Department</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp) => (
                                            <tr key={emp.employee_id}>
                                                <td>
                                                    <span className="badge">{emp.employee_id}</span>
                                                </td>
                                                <td>{emp.full_name}</td>
                                                <td>{emp.department}</td>
                                                <td>
                                                    <div className="toggle-group">
                                                        <button
                                                            className={`toggle-btn ${statuses[emp.employee_id] === "Present"
                                                                    ? "toggle-btn--present"
                                                                    : ""
                                                                }`}
                                                            onClick={() =>
                                                                setStatuses({
                                                                    ...statuses,
                                                                    [emp.employee_id]: "Present",
                                                                })
                                                            }
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            className={`toggle-btn ${statuses[emp.employee_id] === "Absent"
                                                                    ? "toggle-btn--absent"
                                                                    : ""
                                                                }`}
                                                            onClick={() =>
                                                                setStatuses({
                                                                    ...statuses,
                                                                    [emp.employee_id]: "Absent",
                                                                })
                                                            }
                                                        >
                                                            Absent
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card__footer">
                                <button
                                    className="btn btn--primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving…" : "💾 Save Attendance"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ══════════ Tab: History ═══════════════ */}
            {tab === "history" && (
                <div className="card">
                    <h2 className="card__title">Attendance History</h2>

                    {/* Filters */}
                    <div className="filter-bar">
                        <div className="form-group">
                            <label>Employee</label>
                            <select
                                value={historyEmpId}
                                onChange={(e) => setHistoryEmpId(e.target.value)}
                            >
                                <option value="">All employees</option>
                                {employees.map((emp) => (
                                    <option key={emp.employee_id} value={emp.employee_id}>
                                        {emp.full_name} ({emp.employee_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <button className="btn btn--primary" onClick={fetchHistory}>
                            🔍 Search
                        </button>
                    </div>

                    {/* Summary Card */}
                    {summary && (
                        <div className="summary-strip">
                            <strong>{summary.full_name}</strong>
                            <span className="chip chip--success">
                                ✅ {summary.total_present} Present
                            </span>
                            <span className="chip chip--danger">
                                ❌ {summary.total_absent} Absent
                            </span>
                        </div>
                    )}

                    {/* Results */}
                    {historyLoading ? (
                        <div className="page-loader">
                            <div className="spinner" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-state__icon">📜</span>
                            <p>No records found. Use filters and click Search.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((rec) => (
                                        <tr key={rec.id}>
                                            <td>
                                                <span className="badge">{rec.employee_id}</span>
                                            </td>
                                            <td>{rec.date}</td>
                                            <td>
                                                <span
                                                    className={`chip ${rec.status === "Present"
                                                            ? "chip--success"
                                                            : "chip--danger"
                                                        }`}
                                                >
                                                    {rec.status === "Present" ? "✅" : "❌"} {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
