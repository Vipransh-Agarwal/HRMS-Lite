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
├── Procfile             # Render deployment start command
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

## 🌐 Production (Render)

Deployed as a **Web Service** on [Render](https://render.com):
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variable**: `DATABASE_URL` — Neon PostgreSQL connection string

Render auto-deploys on every push to the connected GitHub branch.

> ⚠️ Free tier spins down after 15 min of inactivity. First request after idle takes ~30–50 seconds.

---

## 📡 API Reference

Base URL: `/api`

Interactive docs (Swagger UI): `{base}/docs`

---

### Dashboard

#### `GET /api/dashboard/`

Returns high-level HR metrics.

**Response** `200 OK`
```json
{
  "total_employees": 5,
  "present_today": 3,
  "absent_today": 2,
  "departments": [
    { "department": "Engineering", "count": 3 },
    { "department": "Marketing", "count": 2 }
  ]
}
```

---

### Employees

#### `POST /api/employees/`

Create a new employee.

**Request Body**
```json
{
  "employee_id": "EMP-001",
  "full_name": "Alice Johnson",
  "email": "alice@company.com",
  "department": "Engineering"
}
```

**Response** `201 Created`
```json
{
  "id": 1,
  "employee_id": "EMP-001",
  "full_name": "Alice Johnson",
  "email": "alice@company.com",
  "department": "Engineering",
  "created_at": "2026-02-18T10:30:00Z"
}
```

**Error** `409 Conflict` — if `employee_id` already exists.

---

#### `GET /api/employees/`

List all employees (ordered by newest first).

**Response** `200 OK` — Array of employee objects (same shape as creation response).

---

#### `GET /api/employees/{employee_id}`

Get a single employee by their `employee_id`.

**Response** `200 OK` — Single employee object.

**Error** `404 Not Found` — if employee doesn't exist.

---

#### `DELETE /api/employees/{employee_id}`

Delete an employee and all their attendance records (cascade).

**Response** `204 No Content`

**Error** `404 Not Found` — if employee doesn't exist.

---

### Attendance

#### `POST /api/attendance/`

Mark or update attendance for a single employee on a given date (upsert).

**Request Body**
```json
{
  "employee_id": "EMP-001",
  "date": "2026-02-18",
  "status": "Present"
}
```

`status` must be `"Present"` or `"Absent"`.

**Response** `201 Created`
```json
{
  "id": 1,
  "employee_id": "EMP-001",
  "date": "2026-02-18",
  "status": "Present"
}
```

**Errors**: `404` if employee not found, `422` if status is invalid.

---

#### `POST /api/attendance/bulk`

Mark attendance for multiple employees on a single date.

**Request Body**
```json
{
  "date": "2026-02-18",
  "records": [
    { "employee_id": "EMP-001", "status": "Present" },
    { "employee_id": "EMP-002", "status": "Absent" }
  ]
}
```

**Response** `201 Created` — Array of attendance record objects.

---

#### `GET /api/attendance/`

Query attendance records with optional filters.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `employee_id` | string | No | Filter by employee |
| `date` | YYYY-MM-DD | No | Filter by exact date |
| `start_date` | YYYY-MM-DD | No | Filter from date (inclusive) |
| `end_date` | YYYY-MM-DD | No | Filter to date (inclusive) |

**Example**: `GET /api/attendance/?employee_id=EMP-001&start_date=2026-02-01&end_date=2026-02-28`

**Response** `200 OK` — Array of attendance record objects, ordered by date descending.

---

#### `GET /api/attendance/summary/{employee_id}`

Get total present/absent day counts for an employee.

**Response** `200 OK`
```json
{
  "employee_id": "EMP-001",
  "full_name": "Alice Johnson",
  "total_present": 15,
  "total_absent": 3
}
```

**Error** `404 Not Found` — if employee doesn't exist.

---

## ⚠️ Assumptions & Limitations

- Database tables are created via `Base.metadata.create_all()` — no migration tool (e.g. Alembic) is used.
- Employee ID is a user-defined string (e.g. `EMP-001`), not auto-generated.
- Attendance status is limited to `"Present"` or `"Absent"`.
- Deleting an employee cascade-deletes all their attendance records.
- No authentication — designed for single-admin use.

---

← Back to [Main README](../README.md)
