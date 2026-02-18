const API_BASE = "http://localhost:8000/api";

async function request(url, options = {}) {
    const res = await fetch(`${API_BASE}${url}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (res.status === 204) return null;

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
}

// ── Employees ────────────────────────────────────────

export const getEmployees = () => request("/employees/");

export const getEmployee = (id) => request(`/employees/${id}`);

export const createEmployee = (payload) =>
    request("/employees/", { method: "POST", body: JSON.stringify(payload) });

export const deleteEmployee = (id) =>
    request(`/employees/${id}`, { method: "DELETE" });

// ── Attendance ───────────────────────────────────────

export const getAttendance = (params = {}) => {
    const query = new URLSearchParams();
    if (params.employee_id) query.set("employee_id", params.employee_id);
    if (params.date) query.set("date", params.date);
    if (params.start_date) query.set("start_date", params.start_date);
    if (params.end_date) query.set("end_date", params.end_date);
    return request(`/attendance/?${query.toString()}`);
};

export const markAttendance = (payload) =>
    request("/attendance/", { method: "POST", body: JSON.stringify(payload) });

export const markAttendanceBulk = (payload) =>
    request("/attendance/bulk", { method: "POST", body: JSON.stringify(payload) });

export const getAttendanceSummary = (employeeId) =>
    request(`/attendance/summary/${employeeId}`);

// ── Dashboard ────────────────────────────────────────

export const getDashboard = () => request("/dashboard/");
