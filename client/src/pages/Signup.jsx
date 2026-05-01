import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/Toast";
import logoImg from "../assets/images/logo.png";
import heroImg from "../assets/images/image.png";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (!form.role || form.role.trim().length < 2)
      errs.role = "Please enter your target role";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/auth/signup", form);
      showToast(res.data.message || "Account created successfully!", "success");
      setTimeout(() => navigate("/login"), 600);
    } catch (error) {
      showToast(
        error.response?.data?.message || error.response?.data?.error || "Signup failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="page-container tech-page auth-page auth-split-page">
      <div className="auth-illustration-side">
        <img src={heroImg} alt="PrepNova Platform" className="auth-hero-img" />
        <div className="auth-illustration-overlay">
          <h2>Start Your Journey</h2>
          <p>Build industry-ready skills with AI-powered practice sessions and personalized coaching.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <img src={logoImg} alt="PrepNova Logo" className="auth-logo" />
          </div>

          <h1 className="section-title" id="signup-title">Create Account</h1>
          <p className="section-subtitle">
            Create your profile and start preparing for real industry roles.
          </p>

          <form onSubmit={handleSubmit} id="signup-form">
            <div className="input-group">
              <input
                className={`auth-input ${errors.name ? "input-error" : ""}`}
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                id="signup-name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <input
                className={`auth-input ${errors.email ? "input-error" : ""}`}
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                id="signup-email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <input
                className={`auth-input ${errors.password ? "input-error" : ""}`}
                type="password"
                placeholder="Create password (min 6 characters)"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                id="signup-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="input-group">
              <input
                className={`auth-input ${errors.role ? "input-error" : ""}`}
                type="text"
                placeholder="Target role (e.g. Frontend Developer)"
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                id="signup-role"
              />
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            <button type="submit" className="btn auth-btn" disabled={loading} id="signup-submit">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}