import { Link, useLocation } from "react-router-dom";

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
          Virtual Industry
        </Link>

        <div className="nav-links">
          {!authenticated && (
            <Link to="/login" className={`nav-link${activeLink("/login") ? " active" : ""}`}>
              Login
            </Link>
          )}

          <Link to="/" className={`nav-link${activeLink("/") ? " active" : ""}`}>
            Home
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
                Resume
              </Link>

              <Link to="/dashboard" className={`nav-link${activeLink("/dashboard") ? " active" : ""}`}>
                Dashboard
              </Link>

              <Link to="/interview" className={`nav-link${activeLink("/interview") ? " active" : ""}`}>
                Interview
              </Link>

              <Link to="/voice-coach" className={`nav-link${activeLink("/voice-coach") ? " active" : ""}`}>
                Voice Coach
              </Link>

              <Link to="/communication" className={`nav-link${activeLink("/communication") ? " active" : ""}`}>
                Communication
              </Link>

              <Link to="/vr-interview" className={`nav-link${activeLink("/vr-interview") ? " active" : ""}`}>
                VR Interview
              </Link>

              <Link to="/github-review" className={`nav-link${activeLink("/github-review") ? " active" : ""}`}>
                GitHub Review
              </Link>

              <Link to="/aptitude" className={`nav-link${activeLink("/aptitude") ? " active" : ""}`}>
                Aptitude
              </Link>

              <Link to="/coding" className={`nav-link${activeLink("/coding") ? " active" : ""}`}>
                Coding
              </Link>

              <Link to="/records" className={`nav-link${activeLink("/records") ? " active" : ""}`}>
                Records
              </Link>

              <Link to="/profile" className={`nav-link${activeLink("/profile") ? " active" : ""}`}>
                Profile
              </Link>
            </>
          )}

          {authenticated && started && (
            <button className="nav-link nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
