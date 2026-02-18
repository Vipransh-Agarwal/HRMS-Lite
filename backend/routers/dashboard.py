from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Employee, Attendance
from schemas import DashboardResponse, DepartmentCount

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Returns high-level HR metrics for the dashboard."""
    today = date.today()

    total_employees = db.query(func.count(Employee.id)).scalar()

    present_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Present")
        .scalar()
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Absent")
        .scalar()
    )

    dept_rows = (
        db.query(Employee.department, func.count(Employee.id))
        .group_by(Employee.department)
        .order_by(func.count(Employee.id).desc())
        .all()
    )
    departments = [DepartmentCount(department=d, count=c) for d, c in dept_rows]

    return DashboardResponse(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        departments=departments,
    )
