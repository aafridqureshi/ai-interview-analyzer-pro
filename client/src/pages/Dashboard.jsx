import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
const studentUser = JSON.parse(localStorage.getItem("studentUser")) || {};

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);

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
    fetchAnalyses();
  }, []);

  return (
    <div className="page-container tech-page dashboard-page">
      <Navbar />

      <section className="section">
<div className="dashboard-header">
  <div>
    <h1>Welcome, {studentUser.name || "Student"}</h1>
    <p>
      See your resume analysis records and your progress toward becoming
      industry-ready.
    </p>
  </div>
</div>

        <div className="stats-grid" style={{ marginBottom: "28px" }}>
          <div className="card stat-card">
            <h3>Total Resume Analyses</h3>
            <p>{analyses.length}</p>
          </div>

          <div className="card stat-card">
            <h3>Latest Score</h3>
            <p>{analyses.length > 0 ? analyses[0].score : "No data"}</p>
          </div>

          <div className="card stat-card">
            <h3>Growth Status</h3>
            <p>In Progress</p>
          </div>

          <div className="card stat-card">
            <h3>Next Focus</h3>
            <p>Improve resume quality</p>
          </div>
        </div>

<div className="module-grid" style={{ marginBottom: "30px" }}>
  <Link to="/resume" className="card module-card">
    <h3>Resume Analysis</h3>
    <p>Track your uploaded resumes and improvement history.</p>
  </Link>

  <Link to="/interview" className="card module-card">
    <h3>Interview Preparation</h3>
    <p>Practice common HR and technical interview questions.</p>
  </Link>

  <Link to="/aptitude" className="card module-card">
    <h3>Aptitude Practice</h3>
    <p>Prepare quantitative and logical reasoning questions.</p>
  </Link>

  <Link to="/coding" className="card module-card">
    <h3>Coding Test</h3>
    <p>Improve coding logic and answer writing practice.</p>
  </Link>
</div>

        <div className="card">
          <h2 style={{ marginBottom: "18px", color: "#1b5d93" }}>Previous Resume Analyses</h2>

          {analyses.length === 0 ? (
            <p style={{ color: "#5e7d97" }}>No analyses found yet.</p>
          ) : (
            <div className="history-list">
              {analyses.map((item) => (
                <div key={item._id} className="card history-item">
                  <h4>{item.fileName}</h4>
                  <p><strong>Score:</strong> {item.score}/100</p>
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