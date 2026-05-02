import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export default async function authMiddleware(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // Attach user and session info to request (compatible with existing code)
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || "Student",
    };
    req.session = session.session;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Invalid session",
    });
  }
}