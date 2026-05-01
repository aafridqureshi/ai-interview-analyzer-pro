import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("studentUser", JSON.stringify(res.data.user));

      alert(res.data.message || "Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-container tech-page auth-page">
      <Navbar />
      <section className="section">
        <div className="card auth-card">
          <h1 className="section-title" style={{ marginBottom: "10px" }}>
            Login
          </h1>

          <p className="section-subtitle" style={{ marginBottom: "25px" }}>
            Login to access your student dashboard.
          </p>

          <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit" className="btn auth-btn">
              Login
            </button>
          </form>

          <p style={{ marginTop: "18px", textAlign: "center", color: "#5a7895" }}>
            Do not have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </section>
    </div>
  );
}