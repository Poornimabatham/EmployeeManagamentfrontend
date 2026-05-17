import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if adminSecret is filled, send role as admin, else employee
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.adminSecret ? "admin" : "employee",
      adminSecret: form.adminSecret || undefined,
    };
    try {
      await API.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Full Name"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />
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
        <input
          placeholder="Admin Secret Code (leave blank if employee)"
          type="password"
          onChange={(e) => setForm({ ...form, adminSecret: e.target.value })}
          style={{ ...styles.input, borderColor: "#aaa" }}
        />
        <p style={styles.hint}>
          {form.adminSecret
            ? "🔐 Registering as Admin"
            : "👤 Registering as Employee"}
        </p>
        <button type="submit" style={styles.btn}>
          Register
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link
          to="/login"
          className="btn btn-success text-white"
          style={{ padding: "0.2rem 0.8rem", margin: "10px 10px" }}
        >
          login
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
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 4,
  },
  error: { color: "red" },
  hint: { margin: 0, fontSize: 13, color: "#555" },
};
