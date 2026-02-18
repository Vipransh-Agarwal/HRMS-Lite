import { useState, useEffect } from "react";
import { getDashboard } from "../api";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDashboard()
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="page-loader">
                <div className="spinner" />
                <p>Loading dashboard…</p>
            </div>
        );

    if (error)
        return (
            <div className="error-banner">
                <span className="error-icon">⚠</span> {error}
            </div>
        );

    const maxCount = Math.max(...(data.departments.map((d) => d.count) || [1]), 1);

    return (
        <div className="dashboard">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
                At-a-glance summary of your workforce
            </p>

            {/* ── Summary Cards ─────────────────────────── */}
            <div className="card-grid">
                <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon">👥</div>
                    <div className="stat-card__body">
                        <span className="stat-card__value">{data.total_employees}</span>
                        <span className="stat-card__label">Total Employees</span>
                    </div>
                </div>
                <div className="stat-card stat-card--success">
                    <div className="stat-card__icon">✅</div>
                    <div className="stat-card__body">
                        <span className="stat-card__value">{data.present_today}</span>
                        <span className="stat-card__label">Present Today</span>
                    </div>
                </div>
                <div className="stat-card stat-card--danger">
                    <div className="stat-card__icon">❌</div>
                    <div className="stat-card__body">
                        <span className="stat-card__value">{data.absent_today}</span>
                        <span className="stat-card__label">Absent Today</span>
                    </div>
                </div>
                <div className="stat-card stat-card--info">
                    <div className="stat-card__icon">🏢</div>
                    <div className="stat-card__body">
                        <span className="stat-card__value">{data.departments.length}</span>
                        <span className="stat-card__label">Departments</span>
                    </div>
                </div>
            </div>

            {/* ── Department Chart ──────────────────────── */}
            <div className="card">
                <h2 className="card__title">Employees by Department</h2>
                {data.departments.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state__icon">📊</span>
                        <p>No departments yet. Add employees to see data here.</p>
                    </div>
                ) : (
                    <div className="bar-chart">
                        {data.departments.map((dept) => (
                            <div className="bar-chart__row" key={dept.department}>
                                <span className="bar-chart__label">{dept.department}</span>
                                <div className="bar-chart__track">
                                    <div
                                        className="bar-chart__fill"
                                        style={{ width: `${(dept.count / maxCount) * 100}%` }}
                                    >
                                        <span className="bar-chart__count">{dept.count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
