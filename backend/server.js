import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import configuration
import { ensureDatabaseAndTables, closePool } from "./config/database.js";

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

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const IS_TEST = false;

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Voting System API is running!",
    version: "1.0.0",
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve static files from uploads directory with enhanced headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
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
    } else if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// API Routes with error handling
const routes = [
  { path: "/api/positions", router: positionRoutes },
  { path: "/api/candidates", router: candidateRoutes },
  { path: "/api/voters", router: voterRoutes },
  { path: "/api/elections", router: electionRoutes },
  { path: "/api/auth", router: authRoutes },
  { path: "/api/votes", router: voteRoutes },
  { path: "/api/admins", router: adminRoutes },
  { path: "/api/election-assignments", router: electionAssignmentRoutes },
  { path: "/api/departments", router: departmentRoutes },
  { path: "/api/courses", router: courseRoutes },
  { path: "/api/password-reset", router: passwordResetRoutes }
];

routes.forEach(({ path, router }) => {
  app.use(path, router);
});

// Test route for password reset
app.get("/api/password-reset/test", (req, res) => {
  res.json({ 
    message: "Password reset routes are working!",
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  const errorResponse = {
    error: true,
    message: err.message || 'Something went wrong!',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Add stack trace in development
  if (NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Set appropriate status code
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(errorResponse);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: true,
    message: "Route not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  server.close(async () => {
    try {
      await closePool();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  process.exit(1);
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Initialize database and start server
let server;

const startServer = async () => {
  try {
    // Start server first (for health checks)
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Initialize database after server starts
    try {
      console.log('🗄️ Initializing database...');
      await ensureDatabaseAndTables();
      console.log('✅ Database initialized successfully');
    } catch (dbError) {
      console.error('❌ Database initialization failed:', dbError);
      // Don't exit - server can still serve health checks
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 