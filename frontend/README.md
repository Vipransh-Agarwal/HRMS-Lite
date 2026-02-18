# HRMS Lite — Frontend

Single-page application for HRMS Lite, built with **React** and **Vite**.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router v7 |
| Styling | Vanilla CSS (custom dark theme) |
| HTTP | Fetch API (centralized client) |

## 📂 Structure

```
frontend/src/
├── main.jsx             # React root mount
├── App.jsx              # Sidebar layout + route definitions
├── api.js               # Centralized API client (all endpoint wrappers)
├── index.css            # Full dark theme design system
└── pages/
    ├── Dashboard.jsx    # Summary cards + department bar chart
    ├── Employees.jsx    # Add form, roster table, delete
    └── Attendance.jsx   # Daily bulk marking + history with filters
```

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at `http://localhost:8000`.

## 🎨 Features

- **Dashboard** — 4 stat cards (total employees, present/absent today, departments) + horizontal bar chart
- **Employees** — Slide-down add form, sortable roster table, delete with confirmation
- **Attendance** — Tabbed UI:
  - *Daily Marking* — Bulk Present/Absent toggle buttons with date picker
  - *History* — Filter by employee & date range, per-employee summary strip, clear filters
- **UI/UX** — Premium dark theme, loading spinners, empty states, error banners, slide animations, responsive sidebar

## ⚠️ Assumptions & Limitations

- The API base URL (`http://localhost:8000/api`) is hardcoded in `api.js` — update it for production deployment.
- No state management library — uses React's built-in `useState`/`useEffect`.
- Date pickers use native HTML `<input type="date">` — appearance varies by browser.
- No unit tests included — the app was verified via end-to-end manual testing.

---

← Back to [Main README](../README.md)
