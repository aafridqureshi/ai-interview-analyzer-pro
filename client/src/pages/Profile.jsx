import Navbar from "../components/navbar";

export default function Profile() {
  const studentUser = JSON.parse(localStorage.getItem("studentUser")) || {};

  return (
    <div className="page-container tech-page profile-page">
      <Navbar />

      <section className="section">
        <h1 className="section-title">Student Profile</h1>
        <p className="section-subtitle">
          View your saved profile details and current learning direction.
        </p>

        <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ marginBottom: "14px", color: "#4f6f8f" }}>
            <strong>Name:</strong> {studentUser.name || "Not set"}
          </p>
          <p style={{ marginBottom: "14px", color: "#4f6f8f" }}>
            <strong>Email:</strong> {studentUser.email || "Not set"}
          </p>
          <p style={{ marginBottom: "14px", color: "#4f6f8f" }}>
            <strong>Role:</strong> {studentUser.role || "Not set"}
          </p>
          <p style={{ color: "#4f6f8f" }}>
            <strong>Status:</strong> Preparing for industry readiness
          </p>
        </div>
      </section>
    </div>
  );
}