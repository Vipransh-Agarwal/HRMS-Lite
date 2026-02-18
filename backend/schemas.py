from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


# ── Employee Schemas ──────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Attendance Schemas ────────────────────────────────────────────

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: str  # "Present" or "Absent"


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: date
    status: str

    class Config:
        from_attributes = True


class AttendanceBulkItem(BaseModel):
    employee_id: str
    status: str  # "Present" or "Absent"


class AttendanceBulkCreate(BaseModel):
    date: date
    records: list[AttendanceBulkItem]


# ── Dashboard Schemas ─────────────────────────────────────────────

class DepartmentCount(BaseModel):
    department: str
    count: int


class DashboardResponse(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    departments: list[DepartmentCount]
