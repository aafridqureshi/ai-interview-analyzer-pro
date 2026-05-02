import { useEffect, useState } from "react";
import { useSession } from "../lib/auth-client";
import Navbar from "../components/navbar";

export default function Dashboard() {
  const { data: session } = useSession();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = session?.user || JSON.parse(localStorage.getItem("studentUser") || "{}");

  useEffect(() => {
    const fetchAnalyses = async () => {
      const userEmail = user.email || "guest@example.com";
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/analyses?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (data.success) setAnalyses(data.data || []);
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.email) fetchAnalyses();
  }, [user.email]);

  return (
    <div className="page-container tech-page">
      <Navbar />
      <section className="section">
        <div className="dashboard-header">
          <h1>Welcome, {user.name || "Student"}</h1>
          <p className="section-subtitle">Track your progress and performance here.</p>
        </div>

        {loading ? (
          <p>Loading analyses...</p>
        ) : analyses.length > 0 ? (
          <div className="card-grid">
            {analyses.map((a, i) => (
              <div key={i} className="card">
                <h3>{a.fileName}</h3>
                <p>Score: {a.score}/100</p>
                <p>{a.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <p>No analyses yet. Upload a resume to get started!</p>
          </div>
        )}
      </section>
    </div>
  );
}