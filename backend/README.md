# HRMS Lite — Backend

REST API for the HRMS Lite application, built with **FastAPI** and **SQLAlchemy**.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL (Neon) |
| Validation | Pydantic v2 |
| Server | Uvicorn |

## 📂 Structure

```
backend/
├── main.py              # App entry point, CORS, router registration
├── database.py          # Engine, session, Base, get_db dependency
├── models.py            # Employee & Attendance ORM models
├── schemas.py           # Pydantic request/response schemas
├── requirements.txt     # Python dependencies
├── .env                 # DATABASE_URL (gitignored)
└── routers/
    ├── employees.py     # CRUD: create, list, get, delete
    ├── attendance.py    # Mark (single/bulk), query, summary
    └── dashboard.py     # Aggregate stats endpoint
```

## 🚀 Running Locally

```bash
# 1. Set your Neon connection string in .env
#    DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the server
uvicorn main:app --reload
```

The server runs at `http://localhost:8000`. Database tables are auto-created on startup.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/` | Dashboard summary (counts, departments) |
| `GET` | `/api/employees/` | List all employees |
| `POST` | `/api/employees/` | Create a new employee |
| `GET` | `/api/employees/{id}` | Get single employee |
| `DELETE` | `/api/employees/{id}` | Delete employee + cascade attendance |
| `POST` | `/api/attendance/` | Mark attendance for one employee |
| `POST` | `/api/attendance/bulk` | Mark attendance for multiple employees |
| `GET` | `/api/attendance/` | Query records (filters: employee_id, date, start_date, end_date) |
| `GET` | `/api/attendance/summary/{id}` | Total present/absent days for an employee |

Interactive API docs available at `http://localhost:8000/docs` (Swagger UI).

## ⚠️ Assumptions & Limitations

- Database tables are created via `Base.metadata.create_all()` — no migration tool (e.g. Alembic) is used.
- Employee ID is a user-defined string (e.g. `EMP-001`), not auto-generated.
- Attendance status is limited to `"Present"` or `"Absent"`.
- Deleting an employee cascade-deletes all their attendance records.

---

← Back to [Main README](../README.md)
