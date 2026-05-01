import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import logoImg from "../assets/images/logo.png";

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [studentUser, setStudentUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("studentUser")) || {};
    setStudentUser(user);
  }, []);

  const fetchAnalyses = async () => {
    try {
      const userEmail = studentUser.email || "guest@example.com";
      const res = await axios.get(
        `http://localhost:3001/analyses?email=${encodeURIComponent(userEmail)}`
      );
      setAnalyses(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load analyses", error);
    }
  };

  useEffect(() => {
    if (studentUser.email) fetchAnalyses();
  }, [studentUser]);

  const avgScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + (a.score || 0), 0) / analyses.length)
      : "—";

  return (
    <div className="page-container tech-page dashboard-page">
      <Navbar />

      <section className="section">
        <div className="dashboard-header">
          <div className="dashboard-brand">
            <img src={logoImg} alt="PrepNova" className="dashboard-logo" />
            <div>
              <h1>Welcome, {studentUser.name || "Student"}</h1>
              <p>
                Track your resume analyses and progress toward becoming
                industry-ready.
              </p>
            </div>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: "28px" }}>
          <div className="card stat-card stat-accent-blue">
            <span className="stat-icon">📊</span>
            <h3>Total Analyses</h3>
            <p className="stat-value">{analyses.length}</p>
          </div>

          <div className="card stat-card stat-accent-green">
            <span className="stat-icon">⭐</span>
            <h3>Latest Score</h3>
            <p className="stat-value">{analyses.length > 0 ? analyses[0].score : "—"}</p>
          </div>

          <div className="card stat-card stat-accent-purple">
            <span className="stat-icon">📈</span>
            <h3>Average Score</h3>
            <p className="stat-value">{avgScore}</p>
          </div>

          <div className="card stat-card stat-accent-orange">
            <span className="stat-icon">🎯</span>
            <h3>Next Focus</h3>
            <p className="stat-value-sm">Improve resume quality</p>
          </div>
        </div>

        <div className="module-grid" style={{ marginBottom: "30px" }}>
          <Link to="/resume" className="card module-card">
            <span className="module-icon">📄</span>
            <h3>Resume Analysis</h3>
            <p>Track your uploaded resumes and improvement history.</p>
          </Link>

          <Link to="/interview" className="card module-card">
            <span className="module-icon">🎙️</span>
            <h3>Interview Preparation</h3>
            <p>Practice common HR and technical interview questions.</p>
          </Link>

          <Link to="/aptitude" className="card module-card">
            <span className="module-icon">🧠</span>
            <h3>Aptitude Practice</h3>
            <p>Prepare quantitative and logical reasoning questions.</p>
          </Link>

          <Link to="/coding" className="card module-card">
            <span className="module-icon">💻</span>
            <h3>Coding Test</h3>
            <p>Improve coding logic and answer writing practice.</p>
          </Link>
        </div>

        <div className="card">
          <h2 className="history-heading">Previous Resume Analyses</h2>

          {analyses.length === 0 ? (
            <p className="empty-state">No analyses found yet. Upload your first resume to get started!</p>
          ) : (
            <div className="history-list">
              {analyses.map((item) => (
                <div key={item._id} className="card history-item">
                  <div className="history-item-header">
                    <h4>{item.fileName}</h4>
                    <span className="history-score-badge">Score: {item.score}/100</span>
                  </div>
                  <p><strong>Strengths:</strong> {item.strengths?.join(", ")}</p>
                  <p><strong>Weaknesses:</strong> {item.weaknesses?.join(", ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}