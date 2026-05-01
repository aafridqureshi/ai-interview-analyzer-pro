import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Records() {
  const studentUser = JSON.parse(localStorage.getItem("studentUser")) || {};
  const email = studentUser.email;

  const [resumeRecords, setResumeRecords] = useState([]);
  const [interviewRecords, setInterviewRecords] = useState([]);
  const [aptitudeRecords, setAptitudeRecords] = useState([]);
  const [codingRecords, setCodingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const [resumeRes, interviewRes, aptitudeRes, codingRes] = await Promise.all([
        axios.get(`${API_URL}/analyses/${email}`).catch(err => {
          console.error("Resume fetch error:", err.message);
          return { data: { data: [] } };
        }),
        axios.get(`${API_URL}/api/interviews/${email}`).catch(err => {
          console.error("Interview fetch error:", err.message);
          return { data: { data: [] } };
        }),
        axios.get(`${API_URL}/api/aptitude/${email}`).catch(err => {
          console.error("Aptitude fetch error:", err.message);
          return { data: { data: [] } };
        }),
        axios.get(`${API_URL}/api/coding/${email}`).catch(err => {
          console.error("Coding fetch error:", err.message);
          return { data: { data: [] } };
        }),
      ]);

      const normalize = (payload) => {
        if (!payload) return [];
        // Handle wrapped format: { data: [...] }
        if (payload.data && Array.isArray(payload.data)) return payload.data;
        // Handle direct array format
        if (Array.isArray(payload)) return payload;
        return [];
      };

      setResumeRecords(normalize(resumeRes.data));
      setInterviewRecords(normalize(interviewRes.data));
      setAptitudeRecords(normalize(aptitudeRes.data));
      setCodingRecords(normalize(codingRes.data));
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="page-container tech-page records-page">
      <Navbar />

      <section className="section page-hero">
        <div className="hero-content">
          <div className="label-pill">Progress Tracker</div>
          <h1 className="section-title">Records</h1>
          <p className="section-subtitle">
            Access your previous performance history and track your readiness for
            interviews, aptitude tests, and coding practice.
          </p>
          <div className="hero-actions">
            <button className="btn">Review Progress</button>
            <button className="btn btn-outline">Sync Records</button>
          </div>
        </div>

        <div className="card enhanced-card">
          <h3>Insights at a glance</h3>
          <p>
            A clear record breakdown helps you identify strengths and where to focus next.
          </p>
          <ul className="feature-list">
            <li>Resume score history</li>
            <li>Interview and aptitude performance</li>
            <li>Coding practice feedback</li>
          </ul>
        </div>
      </section>

      <section className="section">
        {!email ? (
          <div className="card enhanced-card">
            <p style={{ color: "#5e7d97" }}>
              Please login first to see your records.
            </p>
          </div>
        ) : loading ? (
          <div className="card enhanced-card">
            <p style={{ color: "#5e7d97" }}>Loading records...</p>
          </div>
        ) : (
          <>
            <div className="record-section">
              <h2 className="record-title">Resume Analysis History</h2>
              {resumeRecords.length === 0 ? (
                <div className="card enhanced-card">
                  <p>No resume records found.</p>
                </div>
              ) : (
                resumeRecords.map((item) => (
                  <div key={item._id} className="card enhanced-card history-item">
                    <h4>{item.fileName}</h4>
                    <p><strong>Score:</strong> {item.score}/100</p>
                    <p><strong>Strengths:</strong> {item.strengths?.join(", ")}</p>
                    <p><strong>Weaknesses:</strong> {item.weaknesses?.join(", ")}</p>
                  </div>
                ))
              )}
            </div>

            <div className="record-section">
              <h2 className="record-title">Interview History</h2>
              {interviewRecords.length === 0 ? (
                <div className="card enhanced-card">
                  <p>No interview records found.</p>
                </div>
              ) : (
                interviewRecords.map((item) => (
                  <div key={item._id} className="card enhanced-card history-item">
                    <h4>Interview Session</h4>
                    <p><strong>Questions:</strong> {item.questions?.length}</p>
                    <p><strong>Feedback:</strong> {item.feedback}</p>
                    <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="record-section">
              <h2 className="record-title">Aptitude Test History</h2>
              {aptitudeRecords.length === 0 ? (
                <div className="card enhanced-card">
                  <p>No aptitude records found.</p>
                </div>
              ) : (
                aptitudeRecords.map((item) => (
                  <div key={item._id} className="card enhanced-card history-item">
                    <h4>Aptitude Test</h4>
                    <p><strong>Score:</strong> {item.score}/{item.total}</p>
                    <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="record-section">
              <h2 className="record-title">Coding Practice History</h2>
              {codingRecords.length === 0 ? (
                <div className="card enhanced-card">
                  <p>No coding records found.</p>
                </div>
              ) : (
                codingRecords.map((item) => (
                  <div key={item._id} className="card enhanced-card history-item">
                    <h4>{item.question}</h4>
                    <p><strong>Feedback:</strong> {item.feedback}</p>
                    <pre className="code-preview">{item.code}</pre>
                    <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
