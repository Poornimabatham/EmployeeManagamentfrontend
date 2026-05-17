import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AssignTaskModal({ employee, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    start_date: "",
    due_date: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks/assign", { ...form, assigned_to: employee.email });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginTop: 0 }}>
          Assign Task to{" "}
          <span style={{ color: "#1976d2" }}>{employee.name}</span>
        </h3>
        {error && <p style={{ color: "red", margin: "0 0 10px" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {[
            { label: "Title", key: "title", type: "text" },
            { label: "Start Date", key: "start_date", type: "date" },
            { label: "Due Date", key: "due_date", type: "date" },
          ].map(({ label, key, type }) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={styles.input}
              />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              style={styles.input}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 16,
            }}
          >
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleBadge({ role, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isEmployee = role === "employee";

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={isEmployee ? onClick : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        fontWeight: "bold",
        fontSize: 13,
        color: "#fff",
        position: "relative",
        background: isEmployee ? "#2e7d32" : "#7b1fa2",
        cursor: isEmployee ? "pointer" : "default",
      }}
    >
      {isEmployee ? "👤 Employee" : "🛡️ Admin"}
      {isEmployee && hovered && (
        <span style={{ fontSize: 16 }} title="Assign Task">
          📋
        </span>
      )}
      {isEmployee && hovered && (
        <span
          style={{
            position: "absolute",
            top: -32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "#fff",
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: 11,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          📋 Assign Task
        </span>
      )}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    API.get("/users/all")
      .then((res) => setEmployees(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSuccess = () => {
    setSuccessMsg("Task assigned successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Admin Dashboard</h2>
      {successMsg && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMsg}</p>
      )}
      <p>Total users: {employees.length}</p>
      <table
        style={{
          margin: "20px auto",
          borderCollapse: "collapse",
          width: "80%",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "#fff" }}>
            {["ID", "Name", "Email", "Role", "Joined"].map((h) => (
              <th key={h} style={{ padding: "10px 16px" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px 16px" }}>{emp.id}</td>
              <td style={{ padding: "8px 16px" }}>{emp.name}</td>
              <td style={{ padding: "8px 16px" }}>{emp.email}</td>
              <td style={{ padding: "8px 16px", position: "relative" }}>
                <RoleBadge
                  role={emp.role}
                  onClick={() => setSelectedEmp(emp)}
                />
              </td>
              <td style={{ padding: "8px 16px" }}>
                {new Date(emp.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "#f44336",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        Logout
      </button>
      {selectedEmp && (
        <AssignTaskModal
          employee={selectedEmp}
          onClose={() => setSelectedEmp(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: 8,
    padding: 28,
    width: 420,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  field: { marginBottom: 12, textAlign: "left" },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 13,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: 14,
  },
  cancelBtn: {
    padding: "8px 18px",
    background: "#eee",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "8px 18px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
