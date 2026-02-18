import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        {/* ── Sidebar ─────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar__brand">
            <span className="sidebar__logo">🏢</span>
            <h1 className="sidebar__title">HRMS Lite</h1>
          </div>

          <nav className="sidebar__nav">
            <NavLink to="/" end className="nav-link">
              <span className="nav-link__icon">📊</span>
              Dashboard
            </NavLink>
            <NavLink to="/employees" className="nav-link">
              <span className="nav-link__icon">👥</span>
              Employees
            </NavLink>
            <NavLink to="/attendance" className="nav-link">
              <span className="nav-link__icon">📋</span>
              Attendance
            </NavLink>
          </nav>

          <div className="sidebar__footer">
            <span>HRMS Lite v1.0</span>
          </div>
        </aside>

        {/* ── Main Content ────────────────────── */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
