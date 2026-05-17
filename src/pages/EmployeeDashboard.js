import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setProfile(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Employee Dashboard</h2>
      {profile ? (
        <table style={{ margin: "20px auto", borderCollapse: "collapse" }}>
          <tbody>
            {Object.entries({
              Name: profile.name,
              Email: profile.email,
              Role: profile.role,
              Joined: new Date(profile.created_at).toLocaleDateString(),
            }).map(([k, v]) => (
              <tr key={k}>
                <td
                  style={{
                    padding: "8px 16px",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  {k}
                </td>
                <td style={{ padding: "8px 16px" }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
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
