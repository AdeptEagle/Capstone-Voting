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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

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
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }); 