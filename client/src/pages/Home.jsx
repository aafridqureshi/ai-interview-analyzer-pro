import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Home() {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setStarted(localStorage.getItem("appStarted") === "true");
  }, []);

  const startApp = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    localStorage.setItem("appStarted", "true");
    setStarted(true);
    navigate("/dashboard");
  };

  return (
    <div className="page-container tech-page home-page">
      <Navbar />

      <section className="section hero home-hero">
        <div className="hero-visual" />

        <div className="hero-content">
          <h1>Prepare students for real industry with smart AI guidance</h1>
          <p>
            Virtual Industry helps students reduce the skills gap between college learning
            and industry expectations. Analyze your resume, improve your technical profile,
            prepare for interviews, and track your growth in one platform.
          </p>
          <div className="hero-start-wrap">
            <button className="btn btn-start" onClick={startApp}>
              Start
            </button>
            {!started && (
              <p className="start-note">
                Press Start to unlock all sidebar features and begin your journey.
              </p>
            )}
          </div>

        </div>

        <div className="hero-box">
          <h3>What this platform provides</h3>
          <ul>
            <li>AI based resume analysis and scoring</li>
            <li>Skill gap identification</li>
            <li>Personalized learning roadmap</li>
            <li>Student industry-readiness overview</li>
            <li>Interview and career preparation modules</li>
            <li>GitHub review and code feedback</li>
            <li>Voice coaching for mock interviews</li>
            <li>Communication practice and feedback</li>
            <li>Virtual reality interview room with 3D avatar interviewer</li>
            <li>Real-time face and eye contact detection</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="features-intro">
          <div className="features-visual" />
          <div>
            <h2 className="section-title">Core Platform Features</h2>
            <p className="section-subtitle">
              The platform is designed in a simple and modern way so students can easily
              understand what to improve and how to become better prepared for real jobs.
            </p>
          </div>
        </div>

        <div className="features-grid">
          <div className="card feature-card">
            <h3>Resume Analyzer</h3>
            <p>
              Upload your resume and get a score, strengths, weaknesses, and suggestions
              for improvement.
            </p>
          </div>

          <div className="card feature-card">
            <h3>GitHub Review</h3>
            <p>
              Get AI feedback on code quality, repository structure, and project readiness.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Voice Coach</h3>
            <p>
              Practice answers out loud and receive coaching on pace, clarity, and confidence.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Communication Practice</h3>
            <p>
              Improve professional communication with guided sessions and feedback.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Interview Preparation</h3>
            <p>
              Practice interview rounds and improve confidence, speaking clarity, and
              answer structure.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Career Dashboard</h3>
            <p>
              Keep all your analysis records, progress, and learning direction in one
              place.
            </p>
          </div>

          <div className="card feature-card">
            <h3>VR Interview Experience</h3>
            <p>
              Step into a fully immersive virtual interview room with 3D avatar interviewer,
              real-time eye contact detection, and professional feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}