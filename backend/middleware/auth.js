import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";

// Middleware to authenticate and attach user to req
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Middleware to require a specific role or roles
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ error: "Forbidden: No user found" });
    }
    
    // Handle both single role and array of roles
    const requiredRoles = Array.isArray(role) ? role : [role];
    
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
} 