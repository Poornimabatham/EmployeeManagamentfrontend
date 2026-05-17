import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Welcome, {name}!</h2>
      <p>Employee Management Dashboard</p>
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
