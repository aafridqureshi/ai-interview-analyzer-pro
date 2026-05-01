import { useState } from "react";
import Navbar from "../components/navbar";

function parseGitHubRepo(url) {
  try {
    const normalized = url.trim();
    const repoUrl = normalized.replace(/\s+/g, "");
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/i);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function getReviewData(repo, readmeText, topics) {
  const description = repo.description || "No project description provided.";
  const readmeLength = readmeText?.length || 0;
  const hasReadme = readmeLength > 100;
  const hasLicense = !!repo.license;
  const hasHomepage = !!repo.homepage;
  const hasTopics = topics && topics.length > 0;
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const issues = repo.open_issues_count || 0;
  const daysSinceUpdate = Math.max(0, Math.round((Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)));

  const score = Math.min(
    100,
    40 + (hasReadme ? 15 : 0) + (hasLicense ? 10 : 0) + (hasTopics ? 10 : 0) + (hasHomepage ? 5 : 0) + Math.min(20, Math.floor(stars / 5)) - Math.min(10, Math.floor(issues / 5))
  );

  const requirement = `This GitHub project is a ${repo.language || "multi-language"} codebase focused on ${description.toLowerCase()}. The requirement is to deliver a production-ready repository with strong documentation, reliable setup instructions, and clear architecture for maintainers or recruiters.`;

  const needToDo = [
    hasReadme
      ? "Expand the README to include installation, usage examples, and contribution instructions."
      : "Add a strong README with installation steps, examples, and architecture details.",
    hasLicense ? "Confirm the license is clearly visible and matches intended reuse policies." : "Add a license file to clarify how others can use this project.",
    hasTopics ? "Keep repo topics up to date with the project domain and tech stack." : "Add relevant project topics to improve discoverability and clarity.",
    `Update the project metadata with a concise description and a homepage or deployed demo link${hasHomepage ? "" : " if available"}.`,
  ];

  const bestPart = `Best part: The repository has strong community signals and a professional structure. It already shows ${stars} star${stars === 1 ? "" : "s"} and ${forks} fork${forks === 1 ? "" : "s"}, which indicates the project has visible traction and real value.`;

  const thingsToImprove = [];
  if (!hasReadme) thingsToImprove.push("Write a detailed README with purpose, setup, and examples.");
  if (!hasLicense) thingsToImprove.push("Add a license so employers can understand usage rights.");
  if (!hasTopics) thingsToImprove.push("Tag the repo with appropriate topics like frontend, backend, or machine-learning.");
  if (issues > 10) thingsToImprove.push("Close or label open issues and add issue templates for contributors.");
  if (daysSinceUpdate > 60) thingsToImprove.push("Refresh the codebase and update dependencies to show active maintenance.");
  if (!bestPart) thingsToImprove.push("Add more documentation and examples to increase recruiter confidence.");

  return {
    score,
    requirements: [requirement],
    needToDo,
    bestPart,
    improvements: thingsToImprove.length
      ? thingsToImprove
      : ["The repository is in good shape, keep documenting updates and tracking issues."],
    project: {
      name: repo.full_name,
      description,
      language: repo.language,
      stars,
      forks,
      openIssues: issues,
      updated: `${daysSinceUpdate} day${daysSinceUpdate === 1 ? "" : "s"} ago`,
      topics,
      hasHomepage,
      hasLicense,
      readmeLength,
      repoUrl: repo.html_url,
    },
  };
}

export default function GithubReview() {
  const [projectLink, setProjectLink] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    setError("");
    setAnalysis(null);
    const parsed = parseGitHubRepo(projectLink);
    if (!parsed) {
      setError("Enter a valid GitHub repository URL like https://github.com/user/project.");
      return;
    }

    setLoading(true);
    try {
      const headers = { Accept: "application/vnd.github.mercy-preview+json" };
      const repoRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, { headers });
      if (!repoRes.ok) {
        throw new Error("Repository not found or GitHub API rate limit exceeded.");
      }
      const repoData = await repoRes.json();

      const topicsRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/topics`, { headers });
      const topicsData = topicsRes.ok ? await topicsRes.json() : { names: [] };

      const readmeRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`, { headers });
      const readmeJson = readmeRes.ok ? await readmeRes.json() : null;
      let readmeText = "";
      if (readmeJson?.content) {
        readmeText = atob(readmeJson.content.replace(/\n/g, ""));
      }

      setAnalysis(getReviewData(repoData, readmeText, topicsData.names || []));
    } catch (fetchError) {
      setError(fetchError.message || "Could not analyze the repository at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container tech-page github-page">
      <Navbar />

      <section className="section page-hero">
        <div className="hero-content">
          <div className="label-pill">Project Link Review</div>
          <h1 className="section-title">GitHub Project Analyzer</h1>
          <p className="section-subtitle">
            Paste your GitHub project link and get industry-focused analysis: requirements, work needed, strengths, and improvement areas.
          </p>
        </div>

        <div className="card enhanced-card">
          <h3>Analyze a real repository</h3>
          <p>
            This tool inspects your public GitHub repository and gives actionable feedback for recruiters and hiring managers.
          </p>
          <ul className="feature-list">
            <li>Identify core project requirements</li>
            <li>Highlight top strengths and best parts</li>
            <li>Recommend improvements for documentation, structure, and quality</li>
            <li>Score your repository with industry readiness in mind</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card enhanced-card">
          <input
            type="text"
            placeholder="Enter GitHub project link"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            className="auth-input"
          />
          <button className="btn" onClick={handleReview} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Project"}
          </button>
          {error && <p style={{ color: "#b12e2e", marginTop: "14px" }}>{error}</p>}
        </div>

        {analysis && (
          <div className="card enhanced-card" style={{ marginTop: "30px" }}>
            <h2 style={{ marginBottom: "18px" }}>{analysis.project.name}</h2>
            <p style={{ color: "#4f6f8f", marginBottom: "20px" }}>{analysis.project.description}</p>

            <div className="github-summary-grid">
              <div className="github-summary-card">
                <strong>Language</strong>
                <p>{analysis.project.language || "Not specified"}</p>
              </div>
              <div className="github-summary-card">
                <strong>Stars</strong>
                <p>{analysis.project.stars}</p>
              </div>
              <div className="github-summary-card">
                <strong>Forks</strong>
                <p>{analysis.project.forks}</p>
              </div>
              <div className="github-summary-card">
                <strong>Open issues</strong>
                <p>{analysis.project.openIssues}</p>
              </div>
              <div className="github-summary-card">
                <strong>Updated</strong>
                <p>{analysis.project.updated}</p>
              </div>
              <div className="github-summary-card">
                <strong>Topics</strong>
                <p>{analysis.project.topics.length ? analysis.project.topics.join(", ") : "No topics"}</p>
              </div>
            </div>

            <div style={{ marginTop: "28px" }}>
              <h3>Requirement</h3>
              {analysis.requirements.map((item, index) => (
                <p key={index} style={{ color: "#385e8b", lineHeight: 1.8, marginBottom: "12px" }}>
                  {item}
                </p>
              ))}

              <h3>What needs to be done</h3>
              <ul className="feature-list">
                {analysis.needToDo.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>Best part</h3>
              <p style={{ color: "#385e8b", lineHeight: 1.8, marginBottom: "16px" }}>
                {analysis.bestPart}
              </p>

              <h3>Things to improve</h3>
              <ul className="feature-list">
                {analysis.improvements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
