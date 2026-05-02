import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "../components/navbar";
import { showToast } from "../components/Toast";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

const interviewQuestions = [
  "Tell me about your background and experience.",
  "What are your key strengths?",
  "Describe a technical challenge you overcame.",
  "How do you handle feedback?",
  "Where do you see yourself in 5 years?",
];

const createInterviewRoom = (scene) => {
  // Create floor
  const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: 10, height: 10 }, scene);
  floor.material = new BABYLON.StandardMaterial("floorMat", scene);
  floor.material.diffuse = new BABYLON.Color3(0.3, 0.35, 0.4);

  // Create walls
  const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 10, height: 3, depth: 0.2 }, scene);
  backWall.position.z = 5;
  backWall.position.y = 1.5;
  backWall.material = new BABYLON.StandardMaterial("wallMat", scene);
  backWall.material.diffuse = new BABYLON.Color3(0.25, 0.3, 0.35);

  const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: 0.2, height: 3, depth: 10 }, scene);
  leftWall.position.x = -5;
  leftWall.position.y = 1.5;
  leftWall.material = new BABYLON.StandardMaterial("leftWallMat", scene);
  leftWall.material.diffuse = new BABYLON.Color3(0.22, 0.27, 0.32);

  const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: 0.2, height: 3, depth: 10 }, scene);
  rightWall.position.x = 5;
  rightWall.position.y = 1.5;
  rightWall.material = new BABYLON.StandardMaterial("rightWallMat", scene);
  rightWall.material.diffuse = new BABYLON.Color3(0.06, 0.09, 0.11);

  // Create ceiling
  const ceiling = BABYLON.MeshBuilder.CreateBox("ceiling", { width: 10, height: 0.2, depth: 10 }, scene);
  ceiling.position.y = 3;
  ceiling.material = new BABYLON.StandardMaterial("ceilingMat", scene);
  ceiling.material.diffuse = new BABYLON.Color3(0.35, 0.37, 0.4);

  // Lights
  const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
  ambientLight.intensity = 0.6;

  const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 2, -3), scene);
  pointLight.intensity = 0.5;
  pointLight.range = 20;

  return { floor, backWall, leftWall, rightWall, ceiling };
};

const createInterviewerAvatar = (scene) => {
  const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.64, segments: 32 }, scene);
  head.position = new BABYLON.Vector3(0, 1.64, 2);
  head.material = new BABYLON.StandardMaterial("headMat", scene);
  head.material.diffuse = new BABYLON.Color3(0.6, 0.55, 0.48);

  const hair = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.72, segments: 24 }, scene);
  hair.position = new BABYLON.Vector3(0, 1.82, 2);
  hair.scaling = new BABYLON.Vector3(1, 0.5, 1);
  hair.material = new BABYLON.StandardMaterial("hairMat", scene);
  hair.material.diffuse = new BABYLON.Color3(0.04, 0.03, 0.025);

  const neck = BABYLON.MeshBuilder.CreateCylinder("neck", { diameter: 0.22, height: 0.22, tessellation: 16 }, scene);
  neck.position = new BABYLON.Vector3(0, 1.4, 2);
  neck.material = new BABYLON.StandardMaterial("neckMat", scene);
  neck.material.diffuse = new BABYLON.Color3(0.6, 0.55, 0.48);

  const torso = BABYLON.MeshBuilder.CreateBox("torso", { width: 0.92, height: 1.04, depth: 0.5 }, scene);
  torso.position = new BABYLON.Vector3(0, 0.74, 2);
  torso.material = new BABYLON.StandardMaterial("torsoMat", scene);
  torso.material.diffuse = new BABYLON.Color3(0.08, 0.2, 0.36);

  const shoulders = BABYLON.MeshBuilder.CreateBox("shoulders", { width: 1.08, height: 0.2, depth: 0.52 }, scene);
  shoulders.position = new BABYLON.Vector3(0, 1.05, 2);
  shoulders.material = torso.material;

  const leftArm = BABYLON.MeshBuilder.CreateCylinder("leftArm", { diameter: 0.16, height: 0.9, tessellation: 16 }, scene);
  leftArm.position = new BABYLON.Vector3(-0.55, 0.95, 2);
  leftArm.rotation.z = Math.PI / 4.8;
  leftArm.material = neck.material;

  const rightArm = BABYLON.MeshBuilder.CreateCylinder("rightArm", { diameter: 0.16, height: 0.9, tessellation: 16 }, scene);
  rightArm.position = new BABYLON.Vector3(0.55, 0.95, 2);
  rightArm.rotation.z = -Math.PI / 4.8;
  rightArm.material = neck.material;

  const leftLeg = BABYLON.MeshBuilder.CreateCylinder("leftLeg", { diameter: 0.16, height: 0.86, tessellation: 16 }, scene);
  leftLeg.position = new BABYLON.Vector3(-0.18, -0.18, 2);
  leftLeg.material = new BABYLON.StandardMaterial("legMat", scene);
  leftLeg.material.diffuse = new BABYLON.Color3(0.07, 0.07, 0.07);

  const rightLeg = BABYLON.MeshBuilder.CreateCylinder("rightLeg", { diameter: 0.16, height: 0.86, tessellation: 16 }, scene);
  rightLeg.position = new BABYLON.Vector3(0.18, -0.18, 2);
  rightLeg.material = leftLeg.material;

  const leftEye = BABYLON.MeshBuilder.CreateSphere("leftEye", { diameter: 0.1, segments: 16 }, scene);
  leftEye.position = new BABYLON.Vector3(-0.12, 1.72, 2.28);
  leftEye.material = new BABYLON.StandardMaterial("eyeMat", scene);
  leftEye.material.diffuse = new BABYLON.Color3(0.9, 0.9, 0.9);

  const rightEye = BABYLON.MeshBuilder.CreateSphere("rightEye", { diameter: 0.1, segments: 16 }, scene);
  rightEye.position = new BABYLON.Vector3(0.12, 1.72, 2.28);
  rightEye.material = leftEye.material;

  const leftPupil = BABYLON.MeshBuilder.CreateSphere("leftPupil", { diameter: 0.04, segments: 12 }, scene);
  leftPupil.position = new BABYLON.Vector3(-0.12, 1.72, 2.33);
  leftPupil.material = new BABYLON.StandardMaterial("pupilMat", scene);
  leftPupil.material.diffuse = new BABYLON.Color3(0.02, 0.02, 0.02);

  const rightPupil = leftPupil.createInstance("rightPupil");
  rightPupil.position = new BABYLON.Vector3(0.12, 1.72, 2.33);

  const mouth = BABYLON.MeshBuilder.CreateTube(
    "mouth",
    {
      path: [
        new BABYLON.Vector3(-0.11, 1.54, 2.28),
        new BABYLON.Vector3(0, 1.52, 2.28),
        new BABYLON.Vector3(0.11, 1.54, 2.28),
      ],
      radius: 0.02,
      updatable: false,
    },
    scene
  );
  mouth.material = new BABYLON.StandardMaterial("mouthMat", scene);
  mouth.material.diffuse = new BABYLON.Color3(0.5, 0.22, 0.22);

  const avatar = BABYLON.MeshBuilder.CreateBox("avatar", { size: 0 }, scene);
  avatar.addChild(head);
  avatar.addChild(hair);
  avatar.addChild(neck);
  avatar.addChild(torso);
  avatar.addChild(shoulders);
  avatar.addChild(leftArm);
  avatar.addChild(rightArm);
  avatar.addChild(leftLeg);
  avatar.addChild(rightLeg);
  avatar.addChild(leftEye);
  avatar.addChild(rightEye);
  avatar.addChild(leftPupil);
  avatar.addChild(rightPupil);
  avatar.addChild(mouth);

  return { avatar, head, leftEye, rightEye, mouth, torso, leftArm, rightArm };
};

const animateAvatarSpeaking = (avatar, duration = 3) => {
  const startTime = Date.now();
  const animationInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration * 1000) {
      clearInterval(animationInterval);
      if (avatar.head) avatar.head.position.y = 1.64;
      if (avatar.torso) avatar.torso.position.y = 0.74;
      return;
    }

    const t = (elapsed / (duration * 1000)) * Math.PI * 4;
    if (avatar.head) avatar.head.position.y = 1.64 + Math.sin(t) * 0.08;
    if (avatar.torso) avatar.torso.position.y = 0.74 + Math.sin(t * 0.5) * 0.03;
  }, 16);
};

export default function VRInterview() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const avatarRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasVideoRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const [vrSupported, setVrSupported] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [eyeContact, setEyeContact] = useState(0); // 0-100%
  const [cameraActive, setCameraActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Initialize Babylon.js scene
  useEffect(() => {
    if (!canvasRef.current || !sessionStarted) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.15, 0.18, 0.22);

    // Create camera
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.6, -3));
    camera.attachControl(canvasRef.current, true);
    camera.inertia = 0.7;
    camera.angularSensibility = 1000;

    // Create scene
    createInterviewRoom(scene);
    const { avatar, head, leftEye, rightEye, mouth, torso, leftArm, rightArm } = createInterviewerAvatar(scene);

    engineRef.current = engine;
    sceneRef.current = scene;
    avatarRef.current = { avatar, head, leftEye, rightEye, mouth, torso, leftArm, rightArm };
    cameraRef.current = camera;

    // Check VR support
    const checkVRSupport = async () => {
      try {
        await sceneRef.current.createDefaultXRExperienceAsync();
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported("immersive-vr");
          setVrSupported(supported);
        }
      } catch {
        setVrSupported(false);
      }
    };
    checkVRSupport();

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, [sessionStarted]);

  // Speak question
  const speakQuestion = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(interviewQuestions[currentQuestion]);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (avatarRef.current) {
        animateAvatarSpeaking(avatarRef.current, utterance.text.split(" ").length / 2);
      }
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [currentQuestion]);

  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        speakQuestion();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [sessionStarted, speakQuestion]);

  // Start VR session
  const startVR = async () => {
    if (!sceneRef.current || !vrSupported) return;

    try {
      await sceneRef.current.createDefaultXRExperienceAsync();
      await navigator.xr.requestSession("immersive-vr");
    } catch {
      showToast("VR session not available. Ensure WebXR is supported.", "warning");
    }
  };

  // Initialize camera for face detection
  useEffect(() => {
    if (!sessionStarted) return;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
        }
      } catch (error) {
        console.error("Camera access denied", error);
        showToast("Camera access required for VR interview experience.", "warning");
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setCameraActive(false);
    };
  }, [sessionStarted]);

  // Simple face detection using canvas brightness analysis
  useEffect(() => {
    if (!sessionStarted) return;

    const detectFaceSimple = () => {
      const video = videoRef.current;
      const canvas = canvasVideoRef.current;
      if (!video || !canvas || video.readyState < HTMLVideoElement.HAVE_ENOUGH_DATA) {
        setFaceDetected(false);
        setEyeContact(0);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let skinPixels = 0;
      const centerRegion = {
        x: canvas.width * 0.2,
        y: canvas.height * 0.15,
        width: canvas.width * 0.6,
        height: canvas.height * 0.7,
      };

      for (let y = Math.floor(centerRegion.y); y < centerRegion.y + centerRegion.height; y += 4) {
        for (let x = Math.floor(centerRegion.x); x < centerRegion.x + centerRegion.width; x += 4) {
          const offset = (y * canvas.width + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          if (r > 95 && g > 40 && b > 20 && r > b && r > g && Math.abs(r - g) > 15) {
            skinPixels += 1;
          }
        }
      }

      const totalPixelsInRegion = Math.max(1, Math.floor(centerRegion.width / 4) * Math.floor(centerRegion.height / 4));
      const skinPercentage = (skinPixels / totalPixelsInRegion) * 100;

      if (skinPercentage > 10) {
        setFaceDetected(true);
        setEyeContact(Math.min(100, Math.round(70 + (skinPercentage - 10) * 0.5)));
      } else {
        setFaceDetected(false);
        setEyeContact(0);
      }

      ctx.strokeStyle = skinPercentage > 10 ? "#00c853" : "#ff1744";
      ctx.lineWidth = 3;
      ctx.strokeRect(centerRegion.x, centerRegion.y, centerRegion.width, centerRegion.height);
      ctx.fillStyle = `rgba(0, ${skinPercentage > 10 ? 200 : 0}, 0, 0.12)`;
      ctx.fillRect(centerRegion.x, centerRegion.y, centerRegion.width, centerRegion.height);
    };

    detectionIntervalRef.current = window.setInterval(detectFaceSimple, 120);
    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [sessionStarted]);

  const nextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => speakQuestion(), 500);
    }
  };

  const repeatQuestion = () => {
    speakQuestion();
  };

  return (
    <div className="page-container tech-page vr-interview-page">
      <Navbar />
      {!sessionStarted ? (
        <div className="vr-intro">
          <h1>VR Interview Experience</h1>
          <p>Experience a fully immersive virtual interview with an AI interviewer.</p>
          <button className="start-vr-btn" onClick={() => setSessionStarted(true)}>
            Start Interview
          </button>
        </div>
      ) : (
        <div className="vr-container">
          <div className="vr-media-grid">
            <canvas ref={canvasRef} className="vr-scene-canvas" />
            <div className="vr-preview-card">
              <h4>Attention preview</h4>
              <canvas ref={canvasVideoRef} className="vr-preview-canvas" />
              <p>Live video tracking helps the avatar understand your eye contact and presence.</p>
            </div>
          </div>

          <video ref={videoRef} style={{ display: "none" }} autoPlay muted playsInline />

          <div className="vr-controls">
            <div className="vr-status">
              <p>Question: {currentQuestion + 1} / {interviewQuestions.length}</p>
              <p>Face Detected: {faceDetected ? "✓ Yes" : "✗ No"}</p>
              <p>Eye Contact: {eyeContact}%</p>
              <p>Camera: {cameraActive ? "Active" : "Waiting for access"}</p>
              <p>Interviewer: {isSpeaking ? "Speaking..." : "Ready"}</p>
            </div>

            <div className="vr-buttons">
              <button onClick={speakQuestion} disabled={isSpeaking}>
                {isSpeaking ? "Listening..." : "Read Question"}
              </button>
              <button onClick={repeatQuestion} disabled={isSpeaking}>
                Repeat Question
              </button>
              <button onClick={nextQuestion} disabled={currentQuestion === interviewQuestions.length - 1}>
                Next Question
              </button>
              {vrSupported && (
                <button onClick={startVR} className="vr-btn">
                  Enter VR Mode
                </button>
              )}
            </div>

            <div className="vr-question-display">
              <h3>Current Question:</h3>
              <p>{interviewQuestions[currentQuestion]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
