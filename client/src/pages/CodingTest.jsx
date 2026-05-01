import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

export default function CodingTest() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const question = "Write logic to reverse a string.";

  const runMockCheck = async () => {
    const feedback =
      code.trim().length < 20
        ? "Your answer is too short. Try writing proper logic."
        : "Good attempt. Improve formatting, edge case handling, and explanation.";

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    try {
      await axios.post("http://localhost:3001/api/coding", {
        userEmail: studentUser?.email || "guest@example.com",
        question,
        code,
        feedback,
      });
      setResult(feedback);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save coding result");
    }
  };

  return (
    <div className="page-container tech-page coding-page">
      <Navbar />

      <section className="section page-hero">
        <div className="hero-content">
          <div className="label-pill">Code Practice</div>
          <h1 className="section-title">Coding Test Practice</h1>
          <p className="section-subtitle">
            Write your code and get instant feedback on completeness, style, and
            logic.
          </p>
          <div className="hero-actions">
            <button className="btn">Run Review</button>
            <button className="btn btn-outline">Check Examples</button>
          </div>
        </div>

        <div className="card enhanced-card">
          <h3>Write better code</h3>
          <p>
            Focus on correctness, edge cases, and readability to build stronger
            technical solutions.
          </p>
          <ul className="feature-list">
            <li>Handle edge cases clearly</li>
            <li>Keep logic simple and structured</li>
            <li>Explain your solution where needed</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card enhanced-card">
          <h3 style={{ marginBottom: "14px" }}>Question</h3>
          <p style={{ marginBottom: "24px", color: "#4f6f8f" }}>{question}</p>
          <textarea
            className="auth-input"
            rows="10"
            placeholder="Write your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn" onClick={runMockCheck}>
            Check Answer
          </button>
        </div>

        {result && (
          <div className="card enhanced-card" style={{ marginTop: "24px" }}>
            <h2 style={{ color: "#1b5d93", marginBottom: "10px" }}>Code Feedback</h2>
            <p style={{ color: "#5e7d97" }}>{result}</p>
          </div>
        )}
      </section>
    </div>
  );
}
