import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";
import { AdminModel } from "../models/AdminModel.js";
import { VoterModel } from "../models/VoterModel.js";

// Middleware to authenticate and attach user to req
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    
    // Check for username changes (for admins)
    if (user.role === 'admin' || user.role === 'superadmin') {
      try {
        const admin = await AdminModel.getById(user.id);
        if (!admin) {
          return res.status(403).json({ error: "Admin not found" });
        }
        
        // If username has changed, invalidate the token
        if (admin.username !== user.username) {
          return res.status(403).json({ 
            error: "Token invalidated due to username change",
            code: "USERNAME_CHANGED"
          });
        }
      } catch (error) {
        return res.status(403).json({ error: "Authentication error" });
      }
    }
    
    // Check for name changes (for users)
    if (user.role === 'user') {
      try {
        const voter = await VoterModel.getById(user.id);
        if (!voter) {
          return res.status(403).json({ error: "User not found" });
        }
        
        // If name has changed, invalidate the token
        if (voter.name !== user.name) {
          return res.status(403).json({ 
            error: "Token invalidated due to name change",
            code: "NAME_CHANGED"
          });
        }
      } catch (error) {
        return res.status(403).json({ error: "Authentication error" });
      }
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