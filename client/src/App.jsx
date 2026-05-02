import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import ResumeAnalyzer from "./pages/ResumeAnalyser";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Interview from "./pages/Interview";
import VoiceCoach from "./pages/VoiceCoach";
import Aptitude from "./pages/Aptitude";
import CodingTest from "./pages/CodingTest";
import Profile from "./pages/Profile";
import Communication from "./pages/Communication";
import VRInterview from "./pages/VRInterview";
import GithubReview from "./pages/GithubReview";
import Roadmap from "./pages/Roadmap";
import Records from "./pages/Records";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/voice-coach"
        element={
          <ProtectedRoute>
            <VoiceCoach />
          </ProtectedRoute>
        }
      />

      <Route
        path="/aptitude"
        element={
          <ProtectedRoute>
            <Aptitude />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coding"
        element={
          <ProtectedRoute>
            <CodingTest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/communication"
        element={
          <ProtectedRoute>
            <Communication />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vr-interview"
        element={
          <ProtectedRoute>
            <VRInterview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/github-review"
        element={
          <ProtectedRoute>
            <GithubReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <Records />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}