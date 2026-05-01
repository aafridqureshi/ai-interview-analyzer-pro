import { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ResultCard from "./ResultCard";
import { showToast } from "./Toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function FileUpload({ onSaved }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      showToast("Please select a resume file first", "warning");
      return;
    }

    // Validate file type on client side
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) {
      showToast("Only PDF and DOCX files are supported", "error");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be less than 10MB", "error");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", file);

      const studentUser = JSON.parse(localStorage.getItem("studentUser") || "null");
      formData.append("userEmail", studentUser?.email || "guest@example.com");

      const res = await axios.post(`${API_URL}/upload`, formData);
      const resultData = res.data?.result || res.data?.data?.result;

      if (!resultData) {
        throw new Error(res.data?.message || res.data?.error || "Invalid analysis response from server");
      }

      setResult(resultData);
      showToast("Resume analyzed successfully!", "success");

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error(error);
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;
      showToast(serverMessage || "Resume upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card upload-box">
      <div className="file-upload-area">
        <input
          type="file"
          className="file-input"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          id="resume-file-input"
        />
        {file && <p className="file-name">📎 {file.name}</p>}
      </div>

      <button className="btn" onClick={handleUpload} disabled={loading} id="upload-btn">
        {loading ? "Analyzing..." : "Upload and Analyze"}
      </button>

      {loading && <Loader />}
      {result && <ResultCard result={result} />}
    </div>
  );
}