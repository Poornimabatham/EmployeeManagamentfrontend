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
  const [isAdmin, setIsAdmin] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRequestCode = async () => {
    if (!form.email)
      return setError("Enter your email first to receive the admin code.");
    setSendingCode(true);
    setError("");
    try {
      await API.post("/auth/send-admin-code", { email: form.email });
      setCodeSent(true);
      setSuccess(`Admin secret code sent to ${form.email}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: isAdmin ? "admin" : "employee",
      adminSecret: isAdmin ? form.adminSecret : undefined,
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
      {success && <p style={styles.success}>{success}</p>}
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

        {/* Toggle admin registration */}
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => {
              setIsAdmin(e.target.checked);
              setCodeSent(false);
              setSuccess("");
            }}
          />{" "}
          Register as Admin
        </label>

        {isAdmin && (
          <div style={styles.adminBox}>
            <p style={styles.hint}>
              An admin secret code will be sent to your email.
            </p>
            <button
              type="button"
              onClick={handleRequestCode}
              disabled={sendingCode}
              style={styles.codeBtn}
            >
              {sendingCode
                ? "Sending..."
                : codeSent
                  ? "Resend Code"
                  : "Send Admin Code to Email"}
            </button>
            {codeSent && (
              <input
                placeholder="Enter secret code from email"
                type="password"
                required
                onChange={(e) =>
                  setForm({ ...form, adminSecret: e.target.value })
                }
                style={{ ...styles.input, marginTop: 8 }}
              />
            )}
          </div>
        )}

        <p style={styles.roleHint}>
          {isAdmin ? "🔐 Registering as Admin" : "👤 Registering as Employee"}
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
          Login
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
  codeBtn: {
    padding: "8px 14px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    width: "100%",
  },
  error: { color: "red" },
  success: { color: "green" },
  hint: { margin: "0 0 8px", fontSize: 13, color: "#555" },
  roleHint: { margin: 0, fontSize: 13, color: "#555" },
  toggleLabel: { textAlign: "left", fontSize: 14, cursor: "pointer" },
  adminBox: {
    background: "#f0f4ff",
    padding: 12,
    borderRadius: 6,
    border: "1px solid #c5d5f5",
  },
};
