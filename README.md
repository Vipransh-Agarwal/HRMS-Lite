# HRMS Lite

A lightweight, full-stack **Human Resource Management System** for managing employee records and tracking daily attendance.

## 🏗️ Project Overview

HRMS Lite provides a centralized platform for core HR operations:

- **Employee Management** — Add, view, and delete employee records
- **Attendance Tracking** — Mark daily attendance (Present/Absent) with bulk operations
- **Attendance History** — Filter records by employee and date range, view per-employee summaries
- **Dashboard** — At-a-glance metrics: total employees, today's attendance, department-wise breakdown with bar chart

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Neon — serverless cloud) |
| Styling | Vanilla CSS (custom dark theme) |
| Routing | React Router v7 |

## 📂 Project Structure

```
HRMS Lite/
├── backend/          → FastAPI REST API
│   └── README.md
├── frontend/         → React SPA
│   └── README.md
└── README.md         → You are here
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- A free [Neon](https://neon.tech) PostgreSQL database

### 1. Database Setup
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project → copy the connection string
3. Paste it into `backend/.env`:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
   ```

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API runs at `http://localhost:8000` — tables are auto-created on first startup.

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`

## 🌐 Production Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | Deployed via GitHub integration |
| Backend | Render | Deployed via GitHub integration |
| Database | Neon | Serverless PostgreSQL |

- **Frontend** uses `VITE_API_URL` env variable in Vercel to point to the Render backend.
- **Backend** uses `DATABASE_URL` env variable in Render to connect to Neon PostgreSQL.

> See individual READMEs for deployment details:
> - [Backend README](./backend/README.md)
> - [Frontend README](./frontend/README.md)

## ⚠️ Assumptions & Limitations

- **Single user** — No authentication or role-based access control. Designed for a single administrator.
- **No leave/payroll** — Only employee CRUD and attendance tracking are in scope.
- **Cloud database** — Requires a Neon PostgreSQL instance (free tier is sufficient).
- **No offline support** — Requires both backend and frontend servers running.
- **Date handling** — All dates are based on the server's local timezone.

## 📜 License

This project is licensed under the [MIT License](./LICENSE).
