import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get("/users/all")
      .then((res) => setEmployees(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Admin Dashboard</h2>
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
              <td style={{ padding: "8px 16px" }}>{emp.role}</td>
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
        }}
      >
        Logout
      </button>
    </div>
  );
}
