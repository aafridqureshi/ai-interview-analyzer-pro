import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";

export default function Interview() {
  const questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why do you want this role?",
    "Describe one project you built.",
    "How do you handle pressure?",
  ];

  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const studentUser = JSON.parse(localStorage.getItem("studentUser"));
    const generatedFeedback =
      "Good start. Your answers should be more structured, confident, and specific. Try adding real project examples, measurable achievements, and clearer introductions.";

    try {
      await axios.post("http://localhost:3001/api/interviews", {
        userEmail: studentUser?.email || "guest@example.com",
        questions,
        answers,
        feedback: generatedFeedback,
      });

      setFeedback(generatedFeedback);
      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save interview result");
    }
  };

  return (
    <div className="page-container tech-page interview-page">
      <Navbar />

      <section className="section page-hero">
        <div className="hero-content">
          <div className="label-pill">Practice & Improve</div>
          <h1 className="section-title">AI Interview Practice</h1>
          <p className="section-subtitle">
            Practice common interview questions, capture your answers, and
            receive coaching feedback to improve your structure and confidence.
          </p>
          <div className="hero-actions">
            <button className="btn">Start Practice</button>
            <button className="btn btn-outline">View Example Answers</button>
            <button className="btn btn-secondary" onClick={() => navigate("/vr-interview")}>VR Interview Mode</button>
          </div>
        </div>

        <div className="card enhanced-card">
          <h3>Practice smart</h3>
          <p>
            Simulate interview rounds with a focus on storytelling, achievements,
            and clear responses.
          </p>
          <ul className="feature-list">
            <li>Structure your answers like a pro</li>
            <li>Use results and metrics to impress</li>
            <li>Build confidence with guided responses</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card enhanced-card">
          {questions.map((question, index) => (
            <div key={index} style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "10px", color: "#1c5c91" }}>
                Question {index + 1}
              </h3>
              <p style={{ marginBottom: "10px", color: "#4f6f8f" }}>{question}</p>
              <textarea
                className="auth-input"
                rows="4"
                placeholder="Write your answer here"
                value={answers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}

          <button className="btn" onClick={handleSubmit}>
            Submit Interview
          </button>
        </div>

        {submitted && (
          <div className="card enhanced-card" style={{ marginTop: "24px" }}>
            <h2 style={{ color: "#1b5d93", marginBottom: "12px" }}>
              Interview Feedback
            </h2>
            <p style={{ color: "#5e7d97", lineHeight: "1.8" }}>{feedback}</p>
          </div>
        )}
      </section>
    </div>
  );
}
