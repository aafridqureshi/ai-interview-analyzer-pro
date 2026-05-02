import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";
import { authClient } from "../lib/auth-client";
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
      const { data, error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        showToast(error.message || "Login failed. Please check your credentials.", "error");
        return;
      }

      // Store user info for backward compatibility with existing pages
      if (data?.user) {
        localStorage.setItem(
          "studentUser",
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "Student",
          })
        );
      }

      showToast("Login successful!", "success");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (error) {
      showToast(
        error?.message || "Login failed. Please check your credentials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        // Absolute URL: relative paths resolve against API base (3001), not the Vite app
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      showToast("Google login failed. Please try again.", "error");
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

          {/* Google Login Button */}
          <button
            type="button"
            className="btn auth-btn auth-google-btn"
            onClick={handleGoogleLogin}
            id="google-login-btn"
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
            <span>or sign in with email</span>
          </div>

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

            <div className="auth-forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
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