import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/resume", label: "Resume Analyzer" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/interview", label: "Interview" },
    { to: "/communication", label: "Communication" },
    { to: "/voice-coach", label: "Voice Coach" },
    { to: "/vr-interview", label: "VR Interview" },
    { to: "/aptitude", label: "Aptitude" },
    { to: "/coding", label: "Coding Test" },
    { to: "/github-review", label: "Github Review" },
    { to: "/roadmap", label: "Roadmap" },
    { to: "/records", label: "Records" },
    { to: "/profile", label: "Profile" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="logo">Interlyzer AI</div>

        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}