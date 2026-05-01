import { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ResultCard from "./ResultCard";

export default function FileUpload({ onSaved }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file first");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", file);

      const studentUser = JSON.parse(localStorage.getItem("studentUser") || "null");
      formData.append("userEmail", studentUser?.email || "guest@example.com");

      const res = await axios.post("http://localhost:3001/upload", formData);
      const resultData = res.data?.result || res.data?.data?.result;

      if (!resultData) {
        throw new Error(res.data?.error || "Invalid analysis response from server");
      }

      setResult(resultData);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error(error);
      const serverMessage =
        error.response?.data?.error || error.response?.data?.message;
      alert(serverMessage || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card upload-box">
      <input
        type="file"
        className="file-input"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="btn" onClick={handleUpload}>
        Upload and Analyze
      </button>

      {loading && <Loader />}
      {result && <ResultCard result={result} />}
    </div>
  );
}