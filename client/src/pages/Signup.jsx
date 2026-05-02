import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";
import { authClient } from "../lib/auth-client";
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
      const { data, error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        role: form.role.trim(),
      });

      if (error) {
        showToast(
          error.message || "Signup failed. Please try again.",
          "error"
        );
        return;
      }

      showToast("Account created successfully! You can now log in.", "success");
      setTimeout(() => navigate("/login"), 600);
    } catch (error) {
      showToast(
        error?.message || "Signup failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      showToast("Google signup failed. Please try again.", "error");
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

          {/* Google Signup Button */}
          <button
            type="button"
            className="btn auth-btn auth-google-btn"
            onClick={handleGoogleSignup}
            id="google-signup-btn"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: "10px" }}>
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or sign up with email</span>
          </div>

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