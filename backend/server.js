import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import configuration
import { ensureDatabaseAndTables } from "./config/database.js";

// Import middleware
import { uploadsDir } from "./middleware/upload.js";

// Import routes
import positionRoutes from "./routes/positionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voterRoutes from "./routes/voterRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import electionAssignmentRoutes from "./routes/electionAssignmentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import passwordResetRoutes from "./routes/passwordResetRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory with correct headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    // Set Content-Type for common image types
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    }
  }
}));

    // Test endpoint
    app.get("/", (req, res) => {
      res.json("Voting System API is running!");
    });

// API Routes
app.use("/api/positions", positionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/election-assignments", electionAssignmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Test route for password reset
app.get("/api/password-reset/test", (req, res) => {
  res.json({ message: "Password reset routes are working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize database and start server
ensureDatabaseAndTables()
  .then(() => {
    app.listen(3000, () => {
      console.log('Voting System Server is running on port 3000');
      console.log('Registered routes:');
      console.log('- GET /');
      console.log('- POST /api/password-reset/forgot-password');
      console.log('- GET /api/password-reset/verify-token/:token');
      console.log('- POST /api/password-reset/reset-password');
      console.log('- POST /api/password-reset/cleanup-tokens');
      console.log('- GET /api/password-reset/test');
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }); 