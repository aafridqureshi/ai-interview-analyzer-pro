import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useSession } from "../lib/auth-client";

const DAY_MS = 1000 * 60 * 60 * 24;

export default function Roadmap() {
  const { data: session } = useSession();
  const user = session?.user || JSON.parse(localStorage.getItem("studentUser") || "{}");
  const email = user.email || "";

  const [examDate, setExamDate] = useState(() => window.localStorage.getItem("studyPlannerExamDate") || "");
  const [syllabusCoverage, setSyllabusCoverage] = useState(() => Number(window.localStorage.getItem("studyPlannerSyllabusCoverage") || 60));
  const [aptitudeRecords, setAptitudeRecords] = useState([]);
  const [codingRecords, setCodingRecords] = useState([]);
  const [resumeRecords, setResumeRecords] = useState([]);
  const [weakTopic, setWeakTopic] = useState("Quantitative Reasoning");
  const [todayOutcome, setTodayOutcome] = useState("review");
  const [tomorrowPlan, setTomorrowPlan] = useState("");
  const [streak, setStreak] = useState(() => Number(window.localStorage.getItem("studyPlannerStreak") || 0));
  const [missedSessions, setMissedSessions] = useState(() => Number(window.localStorage.getItem("studyPlannerMissed") || 0));
  const [planMessage, setPlanMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem("studyPlannerState") || "null");
    if (saved) {
      setExamDate(saved.examDate || "");
      setSyllabusCoverage(saved.syllabusCoverage || 60);
      setWeakTopic(saved.weakTopic || "Quantitative Reasoning");
      setTomorrowPlan(saved.tomorrowPlan || "");
      setPlanMessage(saved.planMessage || "");
    }
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchRecords = async () => {
      try {
        const [aptRes, codingRes, resumeRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/aptitude/${email}`),
          axios.get(`http://localhost:3001/api/coding/${email}`),
          axios.get(`http://localhost:3001/analyses/${email}`),
        ]);

        setAptitudeRecords(aptRes.data || []);
        setCodingRecords(codingRes.data || []);
        setResumeRecords(resumeRes.data || []);
      } catch (error) {
        console.warn("Could not fetch study records", error);
      }
    };

    fetchRecords();
  }, [email]);

  useEffect(() => {
    window.localStorage.setItem("studyPlannerExamDate", examDate);
  }, [examDate]);

  useEffect(() => {
    window.localStorage.setItem("studyPlannerSyllabusCoverage", syllabusCoverage.toString());
  }, [syllabusCoverage]);

  useEffect(() => {
    window.localStorage.setItem("studyPlannerStreak", streak.toString());
  }, [streak]);

  useEffect(() => {
    window.localStorage.setItem("studyPlannerMissed", missedSessions.toString());
  }, [missedSessions]);

  useEffect(() => {
    window.localStorage.setItem(
      "studyPlannerState",
      JSON.stringify({ examDate, syllabusCoverage, weakTopic, tomorrowPlan, planMessage })
    );
  }, [examDate, syllabusCoverage, weakTopic, tomorrowPlan, planMessage]);

  const performance = useMemo(() => {
    const aptitude = aptitudeRecords.length
      ? aptitudeRecords.reduce((sum, item) => sum + (item.score / Math.max(item.total, 1)) * 100, 0) / aptitudeRecords.length
      : null;
    const coding = codingRecords.length
      ? Math.round(
          (codingRecords.filter((item) => item.feedback?.toLowerCase().includes("well")).length / codingRecords.length) * 100
        )
      : null;
    const resume = resumeRecords.length ? resumeRecords[0].score : null;
    return {
      aptitude: aptitude !== null ? Math.round(aptitude) : null,
      coding: coding !== null ? Math.min(100, coding) : null,
      resume,
      weakTopics: aptitudeRecords.length > 0 && aptitudeRecords[0].score / Math.max(aptitudeRecords[0].total, 1) < 0.6
        ? ["Algebra", "Number Sense"]
        : ["Reasoning", "Verbal"],
    };
  }, [aptitudeRecords, codingRecords, resumeRecords]);

  const daysUntilExam = useMemo(() => {
    if (!examDate) return null;
    const delta = new Date(examDate).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil(delta / DAY_MS));
  }, [examDate]);

  const buildDailyPlan = () => {
    const baseTopic = weakTopic || performance.weakTopics[0];
    const tasks = [
      `Start with a short ${baseTopic} recap and one easy quiz.`,
      syllabusCoverage < 75
        ? `Complete remaining syllabus topics and update your checklist.`
        : `Take a medium mixed quiz with focus on ${baseTopic}.`,
      `Review yesterday's mistakes and redo the hardest questions.`,
      `Do a timed practice session and compare speed versus accuracy.`,
      `Attempt a mini mock and capture the skipped questions.`,
      `Focus on the concept you missed most recently.`,
      `Light revision: flashcards, formula review, and a quick rest.`,
    ];

    if (daysUntilExam !== null && daysUntilExam <= 14) {
      tasks[2] = `Do a focused mock and analyze time spent on each section.`;
      tasks[3] = `Update your exam order strategy based on the mock.`;
      tasks[4] = `Run a review session on the weakest concept. Avoid overload.`;
    }

    return tasks.map((task, index) => ({ day: index === 0 ? "Today" : `Day ${index + 1}`, task }));
  };

  const dailyPlan = useMemo(buildDailyPlan, [weakTopic, syllabusCoverage, daysUntilExam, performance]);

  const quizStrategy = useMemo(() => {
    const score = performance.aptitude ?? performance.coding ?? 50;
    const topic = weakTopic || performance.weakTopics[0];
    const difficulty = score >= 80 ? "hard" : score <= 50 ? "easy" : "medium";
    const mix = score >= 80 ? "30% revision, 40% practice, 30% challenge" : score <= 50 ? "50% revision, 40% practice, 10% challenge" : "40% revision, 40% practice, 20% challenge";
    return {
      topic,
      difficulty,
      message: `Your next test will focus 70% on ${topic} and 30% on revision. Mix ${mix}.`,
    };
  }, [performance, weakTopic]);

  const mistakeLoop = useMemo(() => {
    const repeated = weakTopic || "probability formulas";
    const type = performance.aptitude !== null && performance.aptitude < 60 ? "concept error" : "careless error";
    return {
      repeated,
      type,
      tasks: [
        `Recap the ${repeated} concept with a short lesson.`,
        `Schedule a mini quiz for the same concept after two days.`,
        `Re-test the weak concept in your next review session.`,
      ],
    };
  }, [performance, weakTopic]);

  const examStrategy = useMemo(() => {
    const apt = performance.aptitude ?? 50;
    const coding = performance.coding ?? 55;
    const order = apt <= coding ? "Quant -> Reasoning -> English" : "Coding -> Quant -> Verbal";
    const advice = apt < 60
      ? "You should focus on accuracy first and avoid careless changes."
      : "Keep a steady pace, balance speed with accuracy, and avoid overthinking.";
    return {
      order,
      advice: `You spend too long on reasoning questions. In the next mock, attempt English first, then Quant, then Reasoning. ${advice}`,
    };
  }, [performance]);

  const motivation = useMemo(() => {
    const overloaded = missedSessions >= 2 || (performance.aptitude !== null && performance.aptitude < 50);
    return {
      note: overloaded
        ? "You missed two planned sessions and your accuracy is falling, so I reduced tomorrow's load and added one quick recovery quiz."
        : "Your consistency is strong. Keep the streak by staying on target with short, daily progress.",
      goal: overloaded ? "Reduce overload and recover with a lighter session." : "Maintain the streak and finish what you scheduled.",
    };
  }, [performance, missedSessions]);

  const handleGeneratePlan = () => {
    setPlanMessage(`Your study plan is ready. I scheduled focused work on ${weakTopic} and the planner will update tomorrow's plan automatically.`);
    setTomorrowPlan(`Tomorrow: 30 minutes of ${weakTopic} revision, one ${quizStrategy.difficulty} quiz, and a short strategy review.`);
  };

  const handleAdjustTomorrow = () => {
    const tomorrow = todayOutcome === "improved"
      ? `Tomorrow: Keep the momentum with one medium ${weakTopic} quiz and one strength-building review.`
      : `Tomorrow: Shift focus to ${weakTopic} concept review, add a short easy quiz, and reduce volume.`;
    setTomorrowPlan(tomorrow);
  };

  const recordSession = (completed) => {
    if (completed) {
      setStreak((prev) => prev + 1);
      setMissedSessions((prev) => Math.max(0, prev - 1));
    } else {
      setMissedSessions((prev) => prev + 1);
      setStreak(0);
    }
  };

  return (
    <div className="page-container tech-page roadmap-page">
      <Navbar />

      <section className="section">
        <h1>AI Study Planner</h1>
        <p>Auto-generate a study roadmap, schedule quizzes, analyze mistakes, and coach your exam strategy.</p>

        <div className="card" style={{ marginBottom: "24px" }}>
          <h2>Planner Inputs</h2>
          <div style={{ display: "grid", gap: "16px" }}>
            <label>
              Exam date
              <input
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                style={{ width: "100%", marginTop: "8px" }}
              />
            </label>

            <label>
              Syllabus coverage: {syllabusCoverage}%
              <input
                type="range"
                min="0"
                max="100"
                value={syllabusCoverage}
                onChange={(event) => setSyllabusCoverage(Number(event.target.value))}
                style={{ width: "100%", marginTop: "8px" }}
              />
            </label>

            <label>
              Main weak topic
              <select value={weakTopic} onChange={(event) => setWeakTopic(event.target.value)} style={{ width: "100%", marginTop: "8px" }}>
                <option>Quantitative Reasoning</option>
                <option>Algebra</option>
                <option>Probability</option>
                <option>Polity</option>
                <option>Verbal Ability</option>
                <option>Coding Concepts</option>
              </select>
            </label>

            <button className="btn" onClick={handleGeneratePlan}>Generate Autonomous Plan</button>
          </div>
        </div>

        <div className="card" style={{ display: "grid", gap: "20px", marginBottom: "24px" }}>
          <div>
            <h2>Autonomous Study Planner</h2>
            <p>{planMessage || "Set your exam date, coverage, and weak topic to generate an adaptive study plan."}</p>
            <p><strong>Days until exam:</strong> {daysUntilExam !== null ? daysUntilExam : "Not set"}</p>
            <div style={{ marginTop: "16px" }}>
              {dailyPlan.map((item) => (
                <div key={item.day} style={{ marginBottom: "12px" }}>
                  <strong>{item.day}:</strong> {item.task}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>Adaptive Quiz Master</h2>
            <p>{quizStrategy.message}</p>
            <ul style={{ marginTop: "12px" }}>
              <li><strong>Topic:</strong> {quizStrategy.topic}</li>
              <li><strong>Difficulty:</strong> {quizStrategy.difficulty}</li>
            </ul>
          </div>

          <div>
            <h2>Mistake Analysis & Revision</h2>
            <p>{`You repeatedly confuse ${mistakeLoop.repeated}. This is classified as a ${mistakeLoop.type}.`}</p>
            <ol style={{ marginTop: "12px" }}>
              {mistakeLoop.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2>Exam Strategy Coach</h2>
            <p>{examStrategy.advice}</p>
            <p><strong>Suggested order:</strong> {examStrategy.order}</p>
          </div>

          <div>
            <h2>Goal Monitoring & Motivation</h2>
            <p>{motivation.note}</p>
            <p><strong>Daily streak:</strong> {streak}</p>
            <p><strong>Missed sessions:</strong> {missedSessions}</p>
            <button className="btn" style={{ marginRight: "12px" }} onClick={() => recordSession(true)}>
              Log session complete
            </button>
            <button className="btn btn-secondary" onClick={() => recordSession(false)}>
              Missed session
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: "24px" }}>
          <h2>Tomorrow’s adaptive plan</h2>
          <p>Tell the planner how today went and the agent will update the next study action.</p>
          <label style={{ display: "block", marginBottom: "12px" }}>
            Today’s result
            <select value={todayOutcome} onChange={(event) => setTodayOutcome(event.target.value)} style={{ width: "100%", marginTop: "8px" }}>
              <option value="improved">Strength improved</option>
              <option value="review">Needs review</option>
              <option value="struggled">Struggled with the section</option>
            </select>
          </label>
          <button className="btn" onClick={handleAdjustTomorrow}>Update tomorrow’s plan</button>
          {tomorrowPlan && (
            <div style={{ marginTop: "16px", background: "#f5f8fb", padding: "16px", borderRadius: "10px" }}>
              <strong>{tomorrowPlan}</strong>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Data insights</h2>
          <p><strong>Aptitude average:</strong> {performance.aptitude !== null ? `${performance.aptitude}%` : "No data yet"}</p>
          <p><strong>Coding signal:</strong> {performance.coding !== null ? `${performance.coding}%` : "No data yet"}</p>
          <p><strong>Latest resume score:</strong> {performance.resume !== null ? `${performance.resume}/100` : "No data yet"}</p>
        </div>
      </section>
    </div>
  );
}
