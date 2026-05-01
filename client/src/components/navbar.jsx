import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo.png";

export default function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const started = localStorage.getItem("appStarted") === "true";
  const authenticated = Boolean(token);

  const activeLink = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentUser");
    window.location.href = "/login";
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-inner">
        <Link to="/" className="logo">
          <img src={logoImg} alt="PrepNova" className="logo-img" />
          <span className="logo-text">PrepNova</span>
        </Link>

        <div className="nav-links">
          {!authenticated && (
            <Link to="/login" className={`nav-link${activeLink("/login") ? " active" : ""}`}>
              <span className="nav-icon">🔑</span> Login
            </Link>
          )}

          <Link to="/" className={`nav-link${activeLink("/") ? " active" : ""}`}>
            <span className="nav-icon">🏠</span> Home
          </Link>

          {!authenticated && (
            <p className="nav-note">Login first to unlock the full platform.</p>
          )}

          {authenticated && !started && (
            <p className="nav-note">Press Start on Home to unlock the platform.</p>
          )}

          {authenticated && started && (
            <>
              <Link to="/resume" className={`nav-link${activeLink("/resume") ? " active" : ""}`}>
                <span className="nav-icon">📄</span> Resume
              </Link>

              <Link to="/dashboard" className={`nav-link${activeLink("/dashboard") ? " active" : ""}`}>
                <span className="nav-icon">📊</span> Dashboard
              </Link>

              <Link to="/interview" className={`nav-link${activeLink("/interview") ? " active" : ""}`}>
                <span className="nav-icon">🎙️</span> Interview
              </Link>

              <Link to="/voice-coach" className={`nav-link${activeLink("/voice-coach") ? " active" : ""}`}>
                <span className="nav-icon">🗣️</span> Voice Coach
              </Link>

              <Link to="/communication" className={`nav-link${activeLink("/communication") ? " active" : ""}`}>
                <span className="nav-icon">💬</span> Communication
              </Link>

              <Link to="/vr-interview" className={`nav-link${activeLink("/vr-interview") ? " active" : ""}`}>
                <span className="nav-icon">🥽</span> VR Interview
              </Link>

              <Link to="/github-review" className={`nav-link${activeLink("/github-review") ? " active" : ""}`}>
                <span className="nav-icon">🐙</span> GitHub Review
              </Link>

              <Link to="/aptitude" className={`nav-link${activeLink("/aptitude") ? " active" : ""}`}>
                <span className="nav-icon">🧠</span> Aptitude
              </Link>

              <Link to="/coding" className={`nav-link${activeLink("/coding") ? " active" : ""}`}>
                <span className="nav-icon">💻</span> Coding
              </Link>

              <Link to="/records" className={`nav-link${activeLink("/records") ? " active" : ""}`}>
                <span className="nav-icon">📋</span> Records
              </Link>

              <Link to="/profile" className={`nav-link${activeLink("/profile") ? " active" : ""}`}>
                <span className="nav-icon">👤</span> Profile
              </Link>
            </>
          )}

          {authenticated && started && (
            <button className="nav-link nav-logout-btn" onClick={handleLogout}>
              <span className="nav-icon">🚪</span> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
