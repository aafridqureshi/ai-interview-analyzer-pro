import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/Toast";
import logoImg from "../assets/images/logo.png";
import heroImg from "../assets/images/image.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("studentUser", JSON.stringify(res.data.user));

      showToast(res.data.message || "Login successful", "success");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Login failed. Please check your credentials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container tech-page auth-page auth-split-page">
      <div className="auth-illustration-side">
        <img src={heroImg} alt="PrepNova Platform" className="auth-hero-img" />
        <div className="auth-illustration-overlay">
          <h2>Prepare for Industry</h2>
          <p>AI-powered interview prep, resume analysis, and skill building — all in one platform.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <img src={logoImg} alt="PrepNova Logo" className="auth-logo" />
          </div>

          <h1 className="section-title" id="login-title">Welcome Back</h1>
          <p className="section-subtitle">Login to access your student dashboard.</p>

          <form onSubmit={handleSubmit} id="login-form">
            <div className="input-group">
              <input
                className={`auth-input ${errors.email ? "input-error" : ""}`}
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                id="login-email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <input
                className={`auth-input ${errors.password ? "input-error" : ""}`}
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                id="login-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn auth-btn" disabled={loading} id="login-submit">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}