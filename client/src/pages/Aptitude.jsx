import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

export default function Aptitude() {
  const questions = [
    {
      question: "What is 25% of 200?",
      options: ["25", "50", "75", "100"],
      answer: "50",
    },
    {
      question: "If a train travels 60 km in 1 hour, how far in 3 hours?",
      options: ["120 km", "180 km", "240 km", "300 km"],
      answer: "180 km",
    },
  ];

  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);

  const submitTest = async () => {
    let totalScore = 0;
    questions.forEach((q, index) => {
      if (selected[index] === q.answer) {
        totalScore++;
      }
    });

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    try {
      await axios.post("http://localhost:3001/api/aptitude", {
        userEmail: studentUser?.email || "guest@example.com",
        score: totalScore,
        total: questions.length,
      });
      setScore(totalScore);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save aptitude result");
    }
  };

  return (
    <div className="page-container tech-page aptitude-page">
      <Navbar />

      <section className="section page-hero">
        <div className="hero-content">
          <div className="label-pill">Quant Skills</div>
          <h1 className="section-title">Aptitude Test</h1>
          <p className="section-subtitle">
            Practice quick aptitude questions designed for placement readiness and
            speed building.
          </p>
          <div className="hero-actions">
            <button className="btn">Take Quick Quiz</button>
            <button className="btn btn-outline">Review Concepts</button>
          </div>
        </div>

        <div className="card enhanced-card">
          <h3>Why aptitude matters</h3>
          <p>
            Aptitude is the foundation of most technical and quantitative tests.
            Keep your problem solving sharp with short, regular practice.
          </p>
          <ul className="feature-list">
            <li>Improve speed and accuracy</li>
            <li>Focus on high-value concepts</li>
            <li>Measure progress with every attempt</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card enhanced-card">
          {questions.map((q, index) => (
            <div key={index} style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "10px", color: "#1c5c91" }}>
                {index + 1}. {q.question}
              </h3>
              {q.options.map((option, i) => (
                <label
                  key={i}
                  style={{ display: "block", marginBottom: "8px", color: "#4f6f8f" }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={selected[index] === option}
                    onChange={() => setSelected({ ...selected, [index]: option })}
                    style={{ marginRight: "8px" }}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button className="btn" onClick={submitTest}>
            Submit Test
          </button>
        </div>

        {score !== null && (
          <div className="card enhanced-card" style={{ marginTop: "24px" }}>
            <h2 style={{ color: "#1b5d93" }}>
              Your Score: {score}/{questions.length}
            </h2>
          </div>
        )}
      </section>
    </div>
  );
}
