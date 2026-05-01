import Navbar from "../components/navbar";
import FileUpload from "../components/FileUpload";

export default function ResumeAnalyzer() {
  return (
    <div className="page-container tech-page resume-page">
      <Navbar />

      <section className="section page-hero">
        <div className="hero-content">
          <div className="label-pill">Resume Intelligence</div>
          <h1 className="section-title">AI Resume Analyzer</h1>
          <p className="section-subtitle">
            Upload your resume and receive industry-ready feedback, score,
            strengths, and weaknesses to improve your job profile.
          </p>
          <div className="hero-actions">
            <button className="btn">Get Instant Feedback</button>
            <button className="btn btn-outline">See Resume Tips</button>
          </div>
        </div>

        <div className="card enhanced-card">
          <h3>Why this matters</h3>
          <p>
            A strong resume helps you stand out. Our AI evaluates clarity,
            structure, achievement statements, and skill alignment.
          </p>
          <ul className="feature-list">
            <li>Keyword optimization for technical roles</li>
            <li>Experience highlighting that employers notice</li>
            <li>Structure and formatting checks</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card enhanced-card">
          <h2>Upload your resume</h2>
          <p>
            Choose a resume file and let the AI provide targeted improvement
            suggestions.
          </p>
          <FileUpload />
        </div>
      </section>
    </div>
  );
}
