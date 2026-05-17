import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {name}! You have admin access.</p>
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
