import { useEffect, useRef, useState } from "react";
import Navbar from "../components/navbar";
import { showToast } from "../components/Toast";

const communicationQuestions = [
  "Tell me about a technical challenge you solved.",
  "How do you explain a complex idea to a non-technical person?",
  "Describe a time when you worked on a team project.",
  "What is your process for receiving feedback?",
  "Why is communication important in engineering?",
];

const communicationModelAnswers = [
  "I faced a bug in a production API that caused intermittent failures. I first reproduced the issue locally, identified the data race, then refactored the async flow and added automated tests. The solution improved stability and reduced error rates by 30%.",
  "I use a simple analogy and focus on outcomes. For example, I compare a software architecture to a city transit system: components are stations, data is passengers, and APIs are routes. This keeps the idea relatable and easy to understand.",
  "In one project, I coordinated with designers and backend developers to launch a new feature. I clarified expectations, shared progress daily, and helped resolve blockers, which kept the team aligned and delivered the feature on time.",
  "I start by listening, asking clarifying questions, and thanking the person for the insight. Then I reflect on the feedback, identify improvements, and follow up with actions so I can learn and grow consistently.",
  "Clear communication keeps engineering teams aligned, avoids misunderstandings, and helps everyone move faster. It also ensures technical tradeoffs are explained and stakeholders understand the impact of decisions.",
];

const companyOptions = {
  tech: [
    "Google",
    "Amazon",
    "Microsoft",
    "Apple",
    "Meta",
    "Netflix",
    "Tesla",
    "IBM",
    "Intel",
    "Oracle",
    "Cisco",
    "Adobe",
    "Salesforce",
    "Uber",
    "Airbnb",
    "Nvidia",
    "Samsung",
    "Dell",
    "Spotify",
    "Twitter",
  ],
  nonTech: [
    "Walmart",
    "Coca-Cola",
    "PepsiCo",
    "Procter & Gamble",
    "Johnson & Johnson",
    "Ford",
    "General Motors",
    "Nestle",
    "Disney",
    "McDonald's",
    "Boeing",
    "ExxonMobil",
    "LVMH",
    "Pfizer",
    "Unilever",
    "Starbucks",
    "UPS",
    "Caterpillar",
    "3M",
    "Nike",
  ],
};

const companyDomains = {
  tech: [
    "Software Engineering",
    "Data Science",
    "Product Management",
    "DevOps / SRE",
    "Frontend / UX",
  ],
  nonTech: [
    "Operations",
    "Finance",
    "Marketing",
    "Human Resources",
    "Sales / Customer Success",
  ],
};

const companyQuestionBank = {
  "Software Engineering": [
    {
      question: "Describe how you would design a scalable caching layer for a globally distributed application.",
      model: "I would use a multi-tier cache with local edge caches and a centralized distributed cache. Cache invalidation would rely on versioned keys and short TTL for dynamic data. This reduces latency and keeps stale content to a minimum.",
      keywords: ["cache", "distributed", "TTL", "invalidation", "edge"],
    },
    {
      question: "How would you debug a production service that occasionally returns a 503 error?",
      model: "I would inspect logs, review recent deployments, and use tracing to find the failing component. I would also check upstream dependencies, load patterns, and resource exhaustion before applying a fix.",
      keywords: ["logs", "tracing", "dependencies", "resource", "deployment"],
    },
    {
      question: "Explain the tradeoffs between a monolithic and microservices architecture.",
      model: "Monoliths give simpler deployment and shared context, while microservices scale independently and isolate failures. The tradeoff is operational complexity versus flexibility and fault isolation.",
      keywords: ["deployment", "scaling", "complexity", "fault", "isolation"],
    },
    {
      question: "What is your approach to reviewing someone else's pull request?",
      model: "I focus on correctness, readability, and alignment with the architecture. I also validate performance, edge cases, and test coverage, then provide clear suggestions and positive feedback.",
      keywords: ["correctness", "readability", "tests", "edge cases", "feedback"],
    },
  ],
  "Data Science": [
    {
      question: "How would you decide whether to use precision or recall for a model in a recommendation system?",
      model: "I would choose precision when incorrect recommendations frustrate users, and recall when discovering all relevant items is more important. The business impact guides the choice.",
      keywords: ["precision", "recall", "business", "recommendation", "users"],
    },
    {
      question: "Describe an A/B test you would run to improve user engagement.",
      model: "I would identify a measurable metric, define control and variant, and ensure statistical power. Then I would monitor results for meaningful lift and segment behavior before rolling out.",
      keywords: ["metric", "variant", "statistical", "lift", "segment"],
    },
    {
      question: "When should you use a decision tree instead of a linear model?",
      model: "Use a decision tree when the data has nonlinear interactions or complex feature thresholds, and interpretability of rules is valuable. Linear models work better for smooth, additive relationships.",
      keywords: ["nonlinear", "features", "thresholds", "interpretability", "additive"],
    },
    {
      question: "How do you validate that a machine learning model is not overfitting?",
      model: "I use cross-validation, compare train and validation performance, and inspect learning curves. Regularization or simpler models help if the gap is too large.",
      keywords: ["cross-validation", "validation", "learning curves", "regularization", "overfitting"],
    },
  ],
  "Product Management": [
    {
      question: "How would you prioritize features for the next product release?",
      model: "I would score features by customer value, feasibility, and strategic impact. Then I would align with stakeholders and choose the highest-impact work that fits the timeline.",
      keywords: ["value", "feasibility", "stakeholder", "impact", "timeline"],
    },
    {
      question: "Describe a time you used customer feedback to change the product direction.",
      model: "I gathered feedback, identified a common pain point, and proposed a pivot that simplified onboarding. The team validated it with prototypes before implementation.",
      keywords: ["feedback", "pain point", "pivot", "prototype", "validation"],
    },
    {
      question: "What metrics would you use to measure product success?",
      model: "I focus on activation, retention, and conversion metrics that reflect real user behavior and business goals. This gives a clear signal of product health.",
      keywords: ["activation", "retention", "conversion", "behavior", "goals"],
    },
    {
      question: "How do you balance technical debt with new feature delivery?",
      model: "I set aside regular capacity for technical debt, quantify the risk, and prioritize debt that blocks future work. This keeps the product healthy while still delivering value.",
      keywords: ["technical debt", "capacity", "risk", "prioritize", "healthy"],
    },
  ],
  "DevOps / SRE": [
    {
      question: "What monitoring signals would you use to detect an outage?",
      model: "I monitor latency, error rate, traffic, and resource utilization. Anomalies in these signals often indicate service degradation before customers complain.",
      keywords: ["latency", "error rate", "traffic", "resource", "anomaly"],
    },
    {
      question: "How do you handle a database migration with zero downtime?",
      model: "I use backward-compatible schema changes, staged rollout, and feature flags. I validate each step in staging and monitor closely during production migration.",
      keywords: ["schema", "rollback", "feature flags", "staging", "monitor"],
    },
    {
      question: "Explain the difference between scalability and reliability?",
      model: "Scalability is about handling more load; reliability is about staying available under failure. Both matter, but they require different design choices.",
      keywords: ["load", "availability", "failure", "design", "redundancy"],
    },
    {
      question: "What is your strategy for securing a production deployment?",
      model: "I apply least privilege, enforce encryption in transit and at rest, and audit access logs. Regular vulnerability scans and patching keep the deployment safe.",
      keywords: ["encryption", "privilege", "audit", "vulnerability", "patching"],
    },
  ],
  "Frontend / UX": [
    {
      question: "How would you improve the performance of a slow web page?",
      model: "I would optimize images, delay noncritical scripts, and reduce render-blocking CSS. Caching and code splitting also help load pages faster.",
      keywords: ["images", "scripts", "CSS", "caching", "code splitting"],
    },
    {
      question: "Describe how you make a UI accessible to all users.",
      model: "I follow accessibility guidelines, use semantic HTML, keyboard navigation, and ensure sufficient color contrast. I also test with screen readers.",
      keywords: ["semantics", "keyboard", "contrast", "screen readers", "guidelines"],
    },
    {
      question: "What is the value of user feedback in UX design?",
      model: "User feedback reveals usability issues and priorities. It lets us iterate on designs and build experiences that actually solve user problems.",
      keywords: ["usability", "iterate", "design", "user problems", "feedback"],
    },
    {
      question: "How do you balance visual design with technical constraints?",
      model: "I collaborate with engineers early, choose feasible patterns, and prioritize the experience. This ensures the design is elegant and deliverable.",
      keywords: ["collaborate", "feasible", "prioritize", "experience", "deliverable"],
    },
  ],
  Operations: [
    {
      question: "How would you reduce supply chain delays at a large retailer?",
      model: "I would analyze bottlenecks, improve supplier communication, and add buffer stock for critical items. Better forecasting and automation reduce delays.",
      keywords: ["bottlenecks", "supplier", "forecasting", "automation", "stock"],
    },
    {
      question: "Describe a process improvement you implemented in operations.",
      model: "I mapped the workflow, removed manual handoffs, and introduced automation for repeatable steps. This reduced lead time and errors.",
      keywords: ["workflow", "handoffs", "automation", "lead time", "errors"],
    },
    {
      question: "What metrics do you track for efficient operations?",
      model: "I track cycle time, throughput, defect rate, and cost per unit. Those metrics show where improvements deliver the most value.",
      keywords: ["cycle time", "throughput", "defect rate", "cost", "value"],
    },
    {
      question: "How do you handle unexpected supply chain disruptions?",
      model: "I activate contingency suppliers, reroute shipments, and communicate proactively with customers. Having scenario plans makes response faster.",
      keywords: ["contingency", "reroute", "communication", "scenario", "response"],
    },
  ],
  Finance: [
    {
      question: "How would you evaluate whether a new product investment is worthwhile?",
      model: "I would forecast revenue, compare it to cost, and use NPV or IRR to assess the return. I also analyze strategic fit and risk.",
      keywords: ["revenue", "cost", "NPV", "IRR", "risk"],
    },
    {
      question: "Describe how you would improve working capital management.",
      model: "I would optimize inventory levels, speed up receivables collection, and extend payables terms without harming suppliers.",
      keywords: ["inventory", "receivables", "payables", "cash flow", "optimization"],
    },
    {
      question: "What would you do if you found a recurring budget variance?",
      model: "I would identify the root cause, adjust forecasts, and discuss corrective actions with stakeholders so the variance stops repeating.",
      keywords: ["variance", "root cause", "forecast", "stakeholders", "corrective"],
    },
    {
      question: "How do you present financial information to non-finance leaders?",
      model: "I simplify metrics, use visuals, and connect numbers to business outcomes so the audience can act confidently.",
      keywords: ["visuals", "business outcomes", "simplify", "audience", "confidence"],
    },
  ],
  Marketing: [
    {
      question: "How would you measure the success of a marketing campaign?",
      model: "I would track awareness, engagement, conversion, and ROI. Monitoring these metrics helps optimize the campaign and justify investment.",
      keywords: ["awareness", "engagement", "conversion", "ROI", "optimize"],
    },
    {
      question: "Describe how you would use customer insights to improve a brand message.",
      model: "I would analyze feedback, identify key emotions, and align the message with what customers value most.",
      keywords: ["feedback", "emotions", "value", "alignment", "message"],
    },
    {
      question: "What is your approach to choosing the right marketing channel?",
      model: "I consider audience habits, campaign goals, and cost. I test the most promising channels and scale what works.",
      keywords: ["audience", "goals", "cost", "test", "scale"],
    },
    {
      question: "How do you keep marketing consistent across regions?",
      model: "I define core brand guidelines and allow local teams to adapt messaging for cultural relevance.",
      keywords: ["guidelines", "local", "culture", "consistency", "adapt"],
    },
  ],
  "Human Resources": [
    {
      question: "How do you build a strong employee onboarding process?",
      model: "I create clear milestones, assign mentors, and collect feedback regularly. Good onboarding helps new hires feel productive fast.",
      keywords: ["milestones", "mentors", "feedback", "productive", "onboarding"],
    },
    {
      question: "Describe a time you helped resolve a conflict at work.",
      model: "I listened to both sides, identified common goals, and guided the discussion toward a respectful solution.",
      keywords: ["listened", "goals", "respectful", "solution", "conflict"],
    },
    {
      question: "What metrics matter for employee engagement?",
      model: "I track retention, survey scores, participation, and productivity to understand engagement trends.",
      keywords: ["retention", "survey", "participation", "productivity", "engagement"],
    },
    {
      question: "How do you keep talent development aligned with business goals?",
      model: "I map development plans to strategic needs and measure progress through performance conversations.",
      keywords: ["development", "strategy", "performance", "goals", "measurement"],
    },
  ],
  "Sales / Customer Success": [
    {
      question: "How do you turn a difficult prospect into a long-term customer?",
      model: "I build trust by listening, demonstrating value, and following up with a tailored solution. The relationship matters more than a quick sale.",
      keywords: ["trust", "value", "solution", "follow up", "relationship"],
    },
    {
      question: "Describe how you handle customer objections during a pitch.",
      model: "I acknowledge concerns, ask clarifying questions, and respond with evidence of how we solve the problem.",
      keywords: ["acknowledge", "questions", "evidence", "problem", "solve"],
    },
    {
      question: "What is your process for prioritizing customer support cases?",
      model: "I assess impact, urgency, and customer value, then solve the highest-risk issues first while keeping customers informed.",
      keywords: ["impact", "urgency", "prioritize", "value", "inform"],
    },
    {
      question: "How do you measure success in customer success?",
      model: "I look at renewal rates, customer satisfaction, and adoption metrics to ensure our customers achieve their goals.",
      keywords: ["renewal", "satisfaction", "adoption", "goals", "metrics"],
    },
  ],
};

export default function Communication() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const FaceDetector = window.FaceDetector;

  const [practiceMode, setPracticeMode] = useState("Communication");
  const [companyType, setCompanyType] = useState("tech");
  const [selectedCompany, setSelectedCompany] = useState(companyOptions.tech[0]);
  const [selectedDomain, setSelectedDomain] = useState(companyDomains.tech[0]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraWarning, setCameraWarning] = useState("");
  const [cameraStatus, setCameraStatus] = useState("Camera inactive");
  const [faceStatus, setFaceStatus] = useState("Waiting for face detection...");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [companyAnswers, setCompanyAnswers] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackDetails, setFeedbackDetails] = useState([]);
  const [reviewComparison, setReviewComparison] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const animationFrameRef = useRef(null);

  const currentCompanyList = companyOptions[companyType];
  const currentDomains = companyDomains[companyType];
  const activeCompanyQuestions = companyQuestionBank[selectedDomain] || [];
  const activeQuestions = practiceMode === "Company Aptitude" ? activeCompanyQuestions.map((item) => item.question) : communicationQuestions;
  const activeModelAnswers = practiceMode === "Company Aptitude" ? activeCompanyQuestions.map((item) => item.model) : communicationModelAnswers;
  const activeAnswers = practiceMode === "Company Aptitude" ? companyAnswers : answers;
  const setActiveAnswers = practiceMode === "Company Aptitude" ? setCompanyAnswers : setAnswers;

  useEffect(() => {
    if (FaceDetector) {
      detectorRef.current = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentCompanyList.includes(selectedCompany)) {
      setSelectedCompany(currentCompanyList[0]);
    }
    if (!currentDomains.includes(selectedDomain)) {
      setSelectedDomain(currentDomains[0]);
    }
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyType]);

  useEffect(() => {
    if (practiceMode === "Company Aptitude") {
      setCompanyAnswers(Array(activeQuestions.length).fill(""));
    } else {
      setAnswers(Array(activeQuestions.length).fill(""));
    }
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceMode, selectedDomain]);

  const resetSession = () => {
    setSessionStarted(false);
    setCurrentQuestion(0);
    setCurrentText("");
    setCurrentTranscript("");
    setSubmitted(false);
    setFeedback("");
    setFeedbackDetails([]);
    setReviewComparison(null);
  };

  const initializeAnswers = () => {
    if (practiceMode === "Company Aptitude") {
      setCompanyAnswers(Array(activeQuestions.length).fill(""));
    } else {
      setAnswers(Array(activeQuestions.length).fill(""));
    }
  };

  const startSession = () => {
    initializeAnswers();
    setSessionStarted(true);
    setCurrentQuestion(0);
    setCurrentText("");
    setCurrentTranscript("");
    setSubmitted(false);
    setFeedback("");
    setReviewComparison(null);
    setCameraWarning("");
    setCameraStatus("Camera inactive");
    setFaceStatus("Waiting for face detection...");
  };

  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) {
      showToast("Text-to-speech is not supported in this browser.", "warning");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(activeQuestions[currentQuestion]);
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
      for (let i = 0; i < event.results.length; i += 1) {
        finalText += event.results[i][0].transcript + " ";
      }
      setCurrentTranscript(finalText.trim());
    };

    recognition.onerror = () => {
      setListening(false);
      showToast("Speech recognition error. Please try again.", "error");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const saveAnswer = () => {
    if (!currentText.trim() && !currentTranscript.trim()) {
      showToast("Please type or speak your answer first.", "warning");
      return;
    }
    const answerText = currentText.trim() || currentTranscript.trim();
    const updated = [...activeAnswers];
    updated[currentQuestion] = answerText;
    setActiveAnswers(updated);
    setCurrentText("");
    setCurrentTranscript("");
  };

  const goToQuestion = (index) => {
    if (index < 0 || index >= activeQuestions.length) return;
    setCurrentQuestion(index);
    setCurrentText(activeAnswers[index] || "");
    setCurrentTranscript("");
    setReviewComparison(null);
  };

  const nextQuestion = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const getAnswerAnalysis = (answer, index) => {
    const sample = answer.trim();
    const lower = sample.toLowerCase();
    const questionObject = practiceMode === "Company Aptitude" ? activeCompanyQuestions[index] : null;
    const expectedKeywords = questionObject?.keywords || [
      ["challenge", "problem", "solution", "impact", "test"],
      ["simple", "analogy", "example", "benefit", "audience"],
      ["team", "collaboration", "role", "responsibility", "deadline"],
      ["listen", "reflect", "improve", "action", "feedback"],
      ["clarity", "alignment", "stakeholders", "teamwork", "trust"],
    ][index] || [];

    let score = 70;
    const positives = [];
    const improvements = [];

    if (!sample) {
      score = 30;
      improvements.push("Answer this question with a complete sentence and an example.");
    } else {
      const keywordMatched = expectedKeywords.filter((word) => lower.includes(word));
      score += Math.min(keywordMatched.length * 8, 25);
      if (keywordMatched.length >= 3) {
        positives.push("You used strong, relevant terms for this question.");
      }
      if (sample.length >= 120) {
        score += 10;
        positives.push("Your response has good detail and structure.");
      } else {
        improvements.push("Expand your answer with more context, examples, or outcomes.");
      }
      if (lower.includes("i think") || lower.includes("maybe") || lower.includes("probably")) {
        improvements.push("Use more confident language and concrete examples.");
      }
      if (!questionObject) {
        if (index === 0 && !lower.includes("test")) {
          improvements.push("Mention testing or verification when describing a technical challenge.");
        }
        if (index === 4 && !lower.includes("team") && !lower.includes("stakeholders")) {
          improvements.push("Explain how communication helps align cross-functional teams.");
        }
      }
    }

    return {
      question: activeQuestions[index],
      answer: sample || "No answer provided yet.",
      model: activeModelAnswers[index] || "No model answer available.",
      score: Math.max(30, Math.min(100, score)),
      positives,
      improvements,
    };
  };

  const compareCurrentAnswer = () => {
    const analysis = getAnswerAnalysis(activeAnswers[currentQuestion] || "", currentQuestion);
    setReviewComparison(analysis);
  };

  const analyzeAllAnswers = () => {
    return activeAnswers.map((answer, index) => getAnswerAnalysis(answer || "", index));
  };

  const generateFeedback = () => {
    const analysisResults = analyzeAllAnswers();
    if (analysisResults.length === 0) return;
    const overallScore = Math.round(
      analysisResults.reduce((sum, item) => sum + item.score, 0) / analysisResults.length
    );

    const tips = analysisResults.reduce((acc, item, index) => {
      const firstImprovement = item.improvements[0];
      if (firstImprovement) {
        acc.push(`Q${index + 1}: ${firstImprovement}`);
      }
      return acc;
    }, []);

    if (tips.length === 0) {
      tips.push("Your answers are clear and structured. Keep practicing to make them even more precise.");
    }

    setFeedback(
      `Overall score: ${overallScore}/100. Focus on clarity, concrete examples, and domain-specific terminology for more impactful answers.`
    );
    setFeedbackDetails(analysisResults);
    setSubmitted(true);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast("Camera access is not supported in this browser.", "warning");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setCameraStatus("Camera active");
      setCameraWarning("Center your face in the frame for practice readiness.");
      detectFaceLoop();
    } catch {
      showToast("Unable to access your camera. Please allow camera permission.", "error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
    setCameraStatus("Camera stopped");
    setCameraWarning("");
    setFaceStatus("Waiting for face detection...");
  };

  const detectFaceLoop = async () => {
    if (!cameraActive || !videoRef.current || !detectorRef.current) return;
    const video = videoRef.current;

    if (video.readyState >= 2) {
      try {
        const faces = await detectorRef.current.detect(video);
        handlePersonaDetection(faces, video);
      } catch {
        setCameraWarning("Face detection is not available in this browser.");
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectFaceLoop);
  };

  const handlePersonaDetection = (faces, video) => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (!faces || faces.length === 0) {
      setCameraWarning("No face detected. Move into the frame.");
      setFaceStatus("Face not found");
      return;
    }

    const face = faces[0];
    const { x, y, width, height } = face.boundingBox;
    context.strokeStyle = "#00ff00";
    context.lineWidth = 3;
    context.strokeRect(x, y, width, height);

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const videoW = video.videoWidth;
    const videoH = video.videoHeight;
    const leftBound = videoW * 0.25;
    const rightBound = videoW * 0.75;
    const topBound = videoH * 0.2;
    const bottomBound = videoH * 0.8;

    if (centerX < leftBound || centerX > rightBound || centerY < topBound || centerY > bottomBound) {
      setCameraWarning("Please center your face in the frame.");
      setFaceStatus("Face off-center");
    } else {
      setCameraWarning("Face detected and centered.");
      setFaceStatus("Ready for practice");
    }
  };

  return (
    <div className="communication-page">
      <Navbar />
      <div className="communication-header">
        <h1>Interview Practice</h1>
        <p>Choose a mode, select a company and domain, then practice using real-style questions and comparison feedback.</p>
      </div>

      <div className="practice-mode-card">
        <div className="mode-buttons">
          <button
            className={practiceMode === "Communication" ? "active" : ""}
            onClick={() => setPracticeMode("Communication")}
          >
            Communication Practice
          </button>
          <button
            className={practiceMode === "Company Aptitude" ? "active" : ""}
            onClick={() => setPracticeMode("Company Aptitude")}
          >
            Company Aptitude
          </button>
        </div>

        {practiceMode === "Company Aptitude" && (
          <div className="company-setup">
            <div className="select-row">
              <label>Company Type</label>
              <select value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
                <option value="tech">Tech Companies</option>
                <option value="nonTech">Non-Tech Companies</option>
              </select>
            </div>
            <div className="select-row">
              <label>Company</label>
              <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                {currentCompanyList.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            <div className="select-row">
              <label>Domain</label>
              <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
                {currentDomains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="session-summary">
          <strong>Current mode:</strong> {practiceMode}
          {practiceMode === "Company Aptitude" && (
            <span> • {selectedCompany} • {selectedDomain}</span>
          )}
          <span> • Questions: {activeQuestions.length}</span>
        </div>

        <div className="compact-summary-card">
          <h3>Session summary</h3>
          <p><strong>Mode:</strong> {practiceMode}</p>
          {practiceMode === "Company Aptitude" ? (
            <>
              <p><strong>Company:</strong> {selectedCompany}</p>
              <p><strong>Domain:</strong> {selectedDomain}</p>
            </>
          ) : (
            <p><strong>Focus:</strong> Communication skills</p>
          )}
          <p><strong>Questions:</strong> {activeQuestions.length}</p>
        </div>

        <button className="start-button" onClick={startSession}>
          {sessionStarted ? "Restart Practice" : "Start Practice"}
        </button>
      </div>

      {sessionStarted && (
        <div className="practice-panel">
          <div className="question-card">
            <h2>Question {currentQuestion + 1}</h2>
            <p>{activeQuestions[currentQuestion]}</p>

            <div className="answer-area">
              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Type your response here..."
              />
              <div className="transcript-preview">
                <strong>Speech transcript:</strong>
                <p>{currentTranscript || "No speech input yet."}</p>
              </div>
            </div>

            <div className="practice-controls">
              <button onClick={saveAnswer}>Save Answer</button>
              <button onClick={startListening}>{listening ? "Listening..." : "Speak Answer"}</button>
              <button onClick={speakQuestion}>Read Question</button>
              <button onClick={compareCurrentAnswer}>Compare with Ideal Answer</button>
            </div>

            <div className="nav-buttons">
              <button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</button>
              <button onClick={nextQuestion} disabled={currentQuestion === activeQuestions.length - 1}>Next</button>
            </div>
          </div>

          <div className="side-panel">
            <div className="camera-card">
              <h3>Camera feedback</h3>
              <p>{cameraStatus}</p>
              <p>{cameraWarning}</p>
              <p>{faceStatus}</p>
              <div className="camera-actions">
                <button onClick={startCamera} disabled={cameraActive}>Start Camera</button>
                <button onClick={stopCamera} disabled={!cameraActive}>Stop Camera</button>
              </div>
              <video ref={videoRef} style={{ display: cameraActive ? "block" : "none" }} muted playsInline />
              <canvas ref={canvasRef} style={{ display: cameraActive ? "block" : "none" }} />
            </div>

            <div className="progress-card">
              <h3>Saved Answers</h3>
              <ul>
                {activeAnswers.map((answer, index) => (
                  <li key={index} className={answer ? "filled" : "empty"} onClick={() => goToQuestion(index)}>
                    Q{index + 1}: {answer ? "Saved" : "Not answered"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {sessionStarted && (
        <div className="feedback-panel">
          <button onClick={generateFeedback} className="feedback-action">Submit for Feedback</button>
          {submitted && (
            <div className="feedback-results">
              <h3>Practice Feedback</h3>
              <p>{feedback}</p>
              <div className="feedback-list">
                {feedbackDetails.map((item, index) => (
                  <div key={index} className="feedback-item">
                    <h4>Question {index + 1}</h4>
                    <p><strong>Your answer:</strong> {item.answer}</p>
                    <p><strong>Model answer:</strong> {item.model}</p>
                    <p><strong>Score:</strong> {item.score}/100</p>
                    <p><strong>What you did well:</strong> {item.positives.join(" ") || "Keep practicing to add more detail."}</p>
                    <p><strong>Improvements:</strong> {item.improvements.join(" ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {reviewComparison && (
        <div className="comparison-panel">
          <h3>Current Answer Comparison</h3>
          <p><strong>Question:</strong> {reviewComparison.question}</p>
          <p><strong>Your answer:</strong> {reviewComparison.answer}</p>
          <p><strong>Model answer:</strong> {reviewComparison.model}</p>
          <p><strong>Score:</strong> {reviewComparison.score}/100</p>
          <p><strong>Suggestions:</strong> {reviewComparison.improvements.join(" ") || "Great answer!"}</p>
        </div>
      )}
    </div>
  );
}
