import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);
      // redirect based on role returned from backend
      navigate(
        data.role === "admin" ? "/admin/dashboard" : "/employee/dashboard",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Email"
          type="email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.btn}>
          Login
        </button>
      </form>
      <p>
        No account?
        <Link
          to="/register"
          className="btn btn-primary text-white"
          style={{ padding: "0.2rem 0.5rem" ,margin:"10px 10px"}}
        >
          Register
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "80px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: 10,
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 4,
  },
  btn: {
    padding: 10,
    background: "#2196F3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 4,
  },
  error: { color: "red" },
};
