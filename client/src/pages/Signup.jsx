import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/signup", form);
      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="page-container tech-page auth-page">
      <Navbar />
      <section className="section">
        <div className="card auth-card">
          <h1 className="section-title" style={{ marginBottom: "10px" }}>Sign Up</h1>
          <p className="section-subtitle" style={{ marginBottom: "25px" }}>
            Create your profile and start preparing for real industry roles.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Create password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <input
              className="auth-input"
              type="text"
              placeholder="Target role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <button type="submit" className="btn auth-btn">
              Create Account
            </button>
          </form>

          <p style={{ marginTop: "18px", textAlign: "center", color: "#5a7895" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </div>
  );
}