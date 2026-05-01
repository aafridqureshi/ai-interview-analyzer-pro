/**
 * Face Detection Utility
 * Handles loading and configuring face-api.js for real-time face and eye detection
 */

let isInitialized = false;
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

export const initializeFaceAPI = async () => {
  if (isInitialized) return;

  try {
    // Load face-api library
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js";
    document.head.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });

    // Load models
    if (window.faceapi) {
      await Promise.all([
        window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      isInitialized = true;
    }
  } catch (error) {
    console.error("Failed to initialize face-api:", error);
  }
};

export const detectFaceAndEyes = async (videoElement) => {
  if (!window.faceapi || !isInitialized) return null;

  try {
    const detections = await window.faceapi
      .detectAllFaces(videoElement, new window.faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length === 0) {
      return {
        faceDetected: false,
        eyeContact: 0,
        faceBoundingBox: null,
      };
    }

    const detection = detections[0];
    const landmarks = detection.landmarks;
    const box = detection.detection.box;

    // Get left and right eye positions
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate eye center
    const leftEyeCenter = {
      x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
      y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length,
    };

    const rightEyeCenter = {
      x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
      y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length,
    };

    // Calculate eye contact by checking if eyes are looking toward camera center
    const videoCenter = {
      x: videoElement.videoWidth / 2,
      y: videoElement.videoHeight / 2,
    };

    const leftEyeDistance = Math.sqrt(
      Math.pow(leftEyeCenter.x - videoCenter.x, 2) + Math.pow(leftEyeCenter.y - videoCenter.y, 2)
    );

    const rightEyeDistance = Math.sqrt(
      Math.pow(rightEyeCenter.x - videoCenter.x, 2) + Math.pow(rightEyeCenter.y - videoCenter.y, 2)
    );

    const avgDistance = (leftEyeDistance + rightEyeDistance) / 2;
    const maxDistance = Math.sqrt(Math.pow(videoElement.videoWidth / 2, 2) + Math.pow(videoElement.videoHeight / 2, 2));
    const eyeContact = Math.max(0, 100 - (avgDistance / maxDistance) * 100);

    return {
      faceDetected: true,
      eyeContact: Math.round(eyeContact),
      faceBoundingBox: { x: box.x, y: box.y, width: box.width, height: box.height },
      faceLandmarks: landmarks,
      expressions: detection.expressions,
    };
  } catch (error) {
    console.error("Face detection error:", error);
    return null;
  }
};

export const drawFaceDetection = (canvas, faceData) => {
  if (!canvas || !faceData || !faceData.faceDetected) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { faceBoundingBox, faceLandmarks } = faceData;

  // Draw face bounding box
  if (faceBoundingBox) {
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 3;
    ctx.strokeRect(faceBoundingBox.x, faceBoundingBox.y, faceBoundingBox.width, faceBoundingBox.height);
  }

  // Draw eye circles
  if (faceLandmarks) {
    const leftEye = faceLandmarks.getLeftEye();
    const rightEye = faceLandmarks.getRightEye();

    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    leftEye.forEach((point) => {
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    });
    ctx.fill();

    ctx.beginPath();
    rightEye.forEach((point) => {
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    });
    ctx.fill();
  }
};
