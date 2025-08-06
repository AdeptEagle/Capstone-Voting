import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import configuration
import { ensureDatabaseAndTables, closePool } from "./config/database.js";

// Import middleware
import { uploadsDir } from "./middleware/upload.js";

// Import services
import { ElectionTimerService } from "./services/ElectionTimerService.js";

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
import ballotHistoryRoutes from "./routes/ballotHistoryRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const IS_TEST = false;

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://capstone-voting.vercel.app',
    'https://capstone-voting.vercel.app/*',
    'https://sscelection2025.vercel.app',
    'https://sscelection2025.vercel.app/*',
    'https://*.vercel.app',
    'https://*.vercel.app/*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));

// Additional CORS headers for all routes
app.use((req, res, next) => {
  // Allow both old and new domains
  const allowedOrigins = [
    'https://capstone-voting.vercel.app',
    'https://sscelection2025.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
    version: "1.0.1",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    deployment: "Latest version with superadmin route"
  });
});

// Test endpoint to verify deployment
app.get("/test-deployment", (req, res) => {
  res.json({
    message: "Deployment test successful",
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
  { path: "/api/password-reset", router: passwordResetRoutes },
  { path: "/api/ballot-history", router: ballotHistoryRoutes }
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
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  
  server.close(async () => {
    try {
      // Cleanup timer service
      ElectionTimerService.cleanup();
      console.log('🧹 Timer service cleaned up');
      
      // Close database pool
      await closePool();
      console.log('🗄️ Database pool closed');
      
      console.log('✅ Server shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
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
      
      // Force fix votes table constraint
      console.log('🔧 Force fixing votes table constraint...');
      const { fixVotesTableConstraint } = await import('./config/database.js');
      await fixVotesTableConstraint(true);
      console.log('✅ Votes table constraint verified/fixed');
      
      // Initialize election timer service
      console.log('⏰ Initializing election timer service...');
      await ElectionTimerService.initialize();
      console.log('✅ Election timer service initialized successfully');
      
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