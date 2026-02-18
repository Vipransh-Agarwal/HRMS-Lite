import { useState, useEffect } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../api";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [form, setForm] = useState({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
    });

    const fetchEmployees = () => {
        setLoading(true);
        getEmployees()
            .then(setEmployees)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);
        try {
            await createEmployee(form);
            setForm({ employee_id: "", full_name: "", email: "", department: "" });
            setFormOpen(false);
            fetchEmployees();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (empId) => {
        if (!confirm(`Delete employee ${empId}? This cannot be undone.`)) return;
        try {
            await deleteEmployee(empId);
            fetchEmployees();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="employees-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage your employee roster</p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={() => setFormOpen(!formOpen)}
                >
                    {formOpen ? "✕ Cancel" : "+ Add Employee"}
                </button>
            </div>

            {/* ── Add Form ────────────────────────────── */}
            {formOpen && (
                <div className="card slide-down">
                    <h2 className="card__title">New Employee</h2>
                    {formError && (
                        <div className="inline-error">
                            <span className="error-icon">⚠</span> {formError}
                        </div>
                    )}
                    <form className="form-grid" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="employee_id">Employee ID</label>
                            <input
                                id="employee_id"
                                name="employee_id"
                                value={form.employee_id}
                                onChange={handleChange}
                                required
                                placeholder="e.g. EMP-001"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="full_name">Full Name</label>
                            <input
                                id="full_name"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="john@company.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input
                                id="department"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                required
                                placeholder="Engineering"
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={submitting}
                            >
                                {submitting ? "Saving…" : "Save Employee"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Error Banner ────────────────────────── */}
            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠</span> {error}
                </div>
            )}

            {/* ── Table ───────────────────────────────── */}
            {loading ? (
                <div className="page-loader">
                    <div className="spinner" />
                    <p>Loading employees…</p>
                </div>
            ) : employees.length === 0 ? (
                <div className="empty-state card">
                    <span className="empty-state__icon">👤</span>
                    <p>No employees yet. Click "+ Add Employee" to get started.</p>
                </div>
            ) : (
                <div className="table-wrapper card">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.employee_id}>
                                    <td>
                                        <span className="badge">{emp.employee_id}</span>
                                    </td>
                                    <td>{emp.full_name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>{new Date(emp.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn btn--ghost btn--danger-text"
                                            onClick={() => handleDelete(emp.employee_id)}
                                            title="Delete employee"
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
