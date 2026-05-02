import { useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../components/Toast";
import { authClient } from "../lib/auth-client";
import logoImg from "../assets/images/logo.png";
import heroImg from "../assets/images/image.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });

      if (authError) {
        showToast(authError.message || "Failed to send reset email.", "error");
        return;
      }

      setSent(true);
      showToast("Password reset email sent! Check your inbox.", "success");
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
          <h2>Reset Access</h2>
          <p>Don't worry — we'll help you get back into your account quickly.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <img src={logoImg} alt="PrepNova Logo" className="auth-logo" />
          </div>

          <h1 className="section-title" id="forgot-title">Forgot Password</h1>

          {!sent ? (
            <>
              <p className="section-subtitle">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} id="forgot-form">
                <div className="input-group">
                  <input
                    className={`auth-input ${error ? "input-error" : ""}`}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    id="forgot-email"
                  />
                  {error && <span className="field-error">{error}</span>}
                </div>

                <button
                  type="submit"
                  className="btn auth-btn"
                  disabled={loading}
                  id="forgot-submit"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-msg">
              <div className="auth-success-icon">✉️</div>
              <p className="section-subtitle">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and spam folder.
              </p>
              <button
                className="btn auth-btn"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                style={{ marginTop: "16px" }}
              >
                Send Again
              </button>
            </div>
          )}

          <p className="auth-switch-text">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
