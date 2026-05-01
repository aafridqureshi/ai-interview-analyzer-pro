import Navbar from "../components/navbar";

export default function Home() {
  return (
    <div className="home-layout">
      <Navbar />

      {/* 👇 YEH WRAPPER ADD KARO */}
      <div className="home-content">

        {/* HERO */}
        <section className="hero">
          <h1>Don't Just Practice. Perform.</h1>
          <p>
            AI-powered interview preparation platform to analyze, improve, and master your skills.
          </p>

          <div>
            <button className="btn">Start Analysis</button>
            <button className="btn btn-outline">Try Interview</button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="card">
            <h3>AI Resume Analyzer</h3>
            <p>Get instant feedback and score your resume.</p>
          </div>

          <div className="card">
            <h3>AI Mock Interview</h3>
            <p>Practice with voice & video AI interviews.</p>
          </div>

          <div className="card">
            <h3>Aptitude & Coding</h3>
            <p>Company-level practice tests and coding challenges.</p>
          </div>

          <div className="card">
            <h3>Progress Dashboard</h3>
            <p>Track your improvement and performance.</p>
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="dashboard">
          <div className="card">
            <h3>Resume Score</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "80%" }}></div>
            </div>
          </div>

          <div className="card">
            <h3>Interview Score</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "65%" }}></div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}