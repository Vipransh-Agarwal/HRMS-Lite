from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Attendance, Employee
from schemas import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceBulkCreate,
)

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark or update attendance for a single employee on a given date."""
    # Verify employee exists
    emp = db.query(Employee).filter(Employee.employee_id == payload.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee '{payload.employee_id}' not found.")

    if payload.status not in ("Present", "Absent"):
        raise HTTPException(status_code=422, detail="Status must be 'Present' or 'Absent'.")

    # Upsert: update if exists, create otherwise
    record = (
        db.query(Attendance)
        .filter(Attendance.employee_id == payload.employee_id, Attendance.date == payload.date)
        .first()
    )
    if record:
        record.status = payload.status
    else:
        record = Attendance(**payload.model_dump())
        db.add(record)

    db.commit()
    db.refresh(record)
    return record


@router.post("/bulk", response_model=list[AttendanceResponse], status_code=status.HTTP_201_CREATED)
def mark_attendance_bulk(payload: AttendanceBulkCreate, db: Session = Depends(get_db)):
    """Mark attendance for multiple employees on a given date."""
    results = []
    for item in payload.records:
        if item.status not in ("Present", "Absent"):
            raise HTTPException(status_code=422, detail=f"Invalid status for '{item.employee_id}'.")

        emp = db.query(Employee).filter(Employee.employee_id == item.employee_id).first()
        if not emp:
            raise HTTPException(status_code=404, detail=f"Employee '{item.employee_id}' not found.")

        record = (
            db.query(Attendance)
            .filter(Attendance.employee_id == item.employee_id, Attendance.date == payload.date)
            .first()
        )
        if record:
            record.status = item.status
        else:
            record = Attendance(employee_id=item.employee_id, date=payload.date, status=item.status)
            db.add(record)

        db.flush()
        db.refresh(record)
        results.append(record)

    db.commit()
    return results


@router.get("/", response_model=list[AttendanceResponse])
def list_attendance(
    employee_id: Optional[str] = Query(None),
    date_exact: Optional[date] = Query(None, alias="date"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
):
    """Query attendance records with optional filters."""
    q = db.query(Attendance)

    if employee_id:
        q = q.filter(Attendance.employee_id == employee_id)
    if date_exact:
        q = q.filter(Attendance.date == date_exact)
    if start_date:
        q = q.filter(Attendance.date >= start_date)
    if end_date:
        q = q.filter(Attendance.date <= end_date)

    return q.order_by(Attendance.date.desc()).all()


@router.get("/summary/{employee_id}")
def attendance_summary(employee_id: str, db: Session = Depends(get_db)):
    """Get total present and absent counts for an employee."""
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found.")

    present = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.employee_id == employee_id, Attendance.status == "Present")
        .scalar()
    )
    absent = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.employee_id == employee_id, Attendance.status == "Absent")
        .scalar()
    )

    return {
        "employee_id": employee_id,
        "full_name": emp.full_name,
        "total_present": present,
        "total_absent": absent,
    }
