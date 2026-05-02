import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

export default function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession();

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="page-container tech-page" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}