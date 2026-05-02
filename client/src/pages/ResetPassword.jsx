import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "../components/Toast";
import { authClient } from "../lib/auth-client";
import logoImg from "../assets/images/logo.png";
import heroImg from "../assets/images/image.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = "New password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!token) {
      showToast("Invalid or missing reset token. Please request a new link.", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: form.password,
        token,
      });

      if (error) {
        showToast(
          error.message || "Failed to reset password. The link may have expired.",
          "error"
        );
        return;
      }

      showToast("Password reset successfully! You can now log in.", "success");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      showToast(
        err?.message || "Something went wrong. Please try again.",
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
          <h2>New Password</h2>
          <p>Set a new password and get back to preparing for your dream job.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <img src={logoImg} alt="PrepNova Logo" className="auth-logo" />
          </div>

          <h1 className="section-title" id="reset-title">Reset Password</h1>
          <p className="section-subtitle">Enter your new password below.</p>

          {!token ? (
            <div className="auth-success-msg">
              <div className="auth-success-icon">⚠️</div>
              <p className="section-subtitle">
                This reset link is invalid or has expired.
              </p>
              <Link to="/forgot-password" className="btn auth-btn" style={{ marginTop: "16px", display: "inline-block", textDecoration: "none" }}>
                Request New Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="reset-form">
              <div className="input-group">
                <input
                  className={`auth-input ${errors.password ? "input-error" : ""}`}
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  id="reset-password"
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="input-group">
                <input
                  className={`auth-input ${errors.confirmPassword ? "input-error" : ""}`}
                  type="password"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm({ ...form, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  id="reset-confirm-password"
                />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className="btn auth-btn"
                disabled={loading}
                id="reset-submit"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="auth-switch-text">
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
