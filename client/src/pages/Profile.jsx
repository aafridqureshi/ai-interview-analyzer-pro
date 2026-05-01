import Navbar from "../components/navbar";
import logoImg from "../assets/images/logo.png";

export default function Profile() {
  const studentUser = JSON.parse(localStorage.getItem("studentUser")) || {};

  return (
    <div className="page-container tech-page profile-page">
      <Navbar />

      <section className="section">
        <div className="profile-header">
          <img src={logoImg} alt="PrepNova" className="profile-logo" />
          <h1 className="section-title">Student Profile</h1>
          <p className="section-subtitle">
            View your saved profile details and current learning direction.
          </p>
        </div>

        <div className="card profile-card" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div className="profile-avatar">
            <span className="avatar-initials">
              {(studentUser.name || "S").charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-label">Name</span>
              <span className="profile-value">{studentUser.name || "Not set"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{studentUser.email || "Not set"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Target Role</span>
              <span className="profile-value">{studentUser.role || "Not set"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Status</span>
              <span className="profile-badge">Preparing for industry readiness</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}