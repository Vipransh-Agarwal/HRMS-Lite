from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import employees, attendance, dashboard

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System API.",
    version="1.0.0",
)

# CORS — allow all origins (no auth needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "HRMS Lite API is running."}
