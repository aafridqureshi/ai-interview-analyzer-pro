import { useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { showToast } from "../components/Toast";
import { useSession } from "../lib/auth-client";

export default function VoiceCoach() {
  const { data: session } = useSession();
  const user = session?.user || JSON.parse(localStorage.getItem("studentUser") || "{}");

  const questions = useMemo(
    () => [
      "Tell me about yourself.",
      "What are your strengths?",
      "Why do you want this role?",
      "Describe one project you built.",
      "How do you handle pressure?",
    ],
    []
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) {
      showToast("Text-to-speech is not supported in this browser.", "warning");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      questions[currentQuestion]
    );
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      showToast("Speech recognition is not supported in this browser.", "warning");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    setListening(true);
    setCurrentTranscript("");

    recognition.onresult = (event) => {
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript + " ";
      }

      setCurrentTranscript(finalText.trim());
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const saveCurrentAnswer = () => {
    if (!currentTranscript.trim()) {
      showToast("Please speak your answer first.", "warning");
      return;
    }

    const updated = [...answers];
    updated[currentQuestion] = currentTranscript.trim();
    setAnswers(updated);
    showToast("Answer saved!", "success");
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setCurrentTranscript(answers[currentQuestion + 1] || "");
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setCurrentTranscript(answers[currentQuestion - 1] || "");
    }
  };

  const generateFeedback = () => {
    const combined = answers.join(" ").toLowerCase();

    let score = 75;
    const tips = [];

    if (combined.length < 100) {
      score -= 15;
      tips.push("Try giving longer and more detailed answers.");
    }

    if (!combined.includes("project")) {
      score -= 10;
      tips.push("Mention real projects or practical work.");
    }

    if (!combined.includes("team") && !combined.includes("collaboration")) {
      score -= 5;
      tips.push("Include teamwork or collaboration examples.");
    }

    if (!combined.includes("learn") && !combined.includes("improve")) {
      score -= 5;
      tips.push("Show your learning mindset and growth attitude.");
    }

    if (tips.length === 0) {
      tips.push(
        "Good job. Your answers are fairly structured and relevant. Keep improving confidence and clarity."
      );
    }

    if (score < 40) score = 40;

    return {
      score,
      text: tips.join(" "),
    };
  };

  const handleSubmitInterview = async () => {
    const validAnswers = answers.filter((a) => a.trim() !== "");

    if (validAnswers.length === 0) {
      showToast("Please record at least one answer before submitting.", "warning");
      return;
    }

    const generated = generateFeedback();

    try {
      setSaving(true);

      await axios.post("http://localhost:3001/api/interviews", {
        userEmail: user?.email || "guest@example.com",
        questions,
        answers,
        feedback: generated.text,
        score: generated.score,
        mode: "voice",
      });

      setFeedback(`Score: ${generated.score}/100. ${generated.text}`);
      setSubmitted(true);
    } catch (error) {
      showToast(error.response?.data?.message || error.response?.data?.error || "Failed to save voice interview", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container tech-page voice-page">
      <Navbar />

      <section className="section">
        <h1 className="section-title">AI Voice Interview Coach</h1>
        <p className="section-subtitle">
          Practice interview speaking and communication skills with voice-based
          questions and answers.
        </p>

        <div className="card voice-card">
          <div className="voice-topbar">
            <span className="voice-badge">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <h2 className="voice-question">{questions[currentQuestion]}</h2>

          <div className="voice-controls">
            <button className="btn" onClick={speakQuestion}>
              🔊 Hear Question
            </button>

            <button className="btn" onClick={startListening}>
              🎤 {listening ? "Listening..." : "Start Speaking"}
            </button>

            <button className="btn-outline" onClick={saveCurrentAnswer}>
              Save Answer
            </button>
          </div>

          <div className="voice-transcript-box">
            <h3>Live Transcript</h3>
            <p>
              {currentTranscript || "Your spoken answer will appear here..."}
            </p>
          </div>

          <div className="voice-navigation">
            <button
              className="btn-outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>

            <button
              className="btn-outline"
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        <div className="card voice-answer-list">
          <h2>Saved Answers</h2>

          {answers.every((item) => !item.trim()) ? (
            <p style={{ color: "#5e7d97" }}>No answers saved yet.</p>
          ) : (
            answers.map((answer, index) => (
              <div key={index} className="voice-answer-item">
                <h4>Q{index + 1}. {questions[index]}</h4>
                <p>{answer || "Not answered yet."}</p>
              </div>
            ))
          )}

          <button className="btn" onClick={handleSubmitInterview} disabled={saving}>
            {saving ? "Saving..." : "Submit Voice Interview"}
          </button>
        </div>

        {submitted && (
          <div className="card" style={{ marginTop: "24px" }}>
            <h2 style={{ color: "#1b5d93", marginBottom: "12px" }}>
              Voice Interview Feedback
            </h2>
            <p style={{ color: "#5e7d97", lineHeight: "1.8" }}>{feedback}</p>
          </div>
        )}
      </section>
    </div>
  );
}
