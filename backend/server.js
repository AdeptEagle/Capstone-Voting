import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'candidate-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

const DB_NAME = "voting_system";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root"
};

const JWT_SECRET = "voting_system_secret_key_2024"; // Change this in production

// Middleware to authenticate and attach user to req
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Middleware to require a specific role or roles
function requireRole(role) {
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

// Create a connection without specifying database to create DB if needed
const dbRoot = mysql.createConnection(dbConfig);

// Helper to run a query and return a promise
function runQuery(connection, sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function ensureDatabaseAndTables() {
  // 1. Create database if it doesn't exist
  await runQuery(dbRoot, `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

  // 2. Connect to the database
  const db = mysql.createConnection({ ...dbConfig, database: DB_NAME });

  // 3. Create tables if they do not exist
  await runQuery(db, `CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    voteLimit INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

  await runQuery(db, `CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    positionId VARCHAR(36) NOT NULL,
    photoUrl TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE
  )`);

  await runQuery(db, `CREATE TABLE IF NOT EXISTS voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    studentId VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255),
    hasVoted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

  await runQuery(db, `CREATE TABLE IF NOT EXISTS votes (
    id VARCHAR(36) PRIMARY KEY,
    voterId INT NOT NULL,
    candidateId VARCHAR(36) NOT NULL,
    electionId VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voterId) REFERENCES voters(id) ON DELETE CASCADE,
    FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (voterId, candidateId, electionId)
  )`);

  await runQuery(db, `CREATE TABLE IF NOT EXISTS elections (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    status ENUM('draft', 'active', 'ended', 'cancelled') DEFAULT 'draft',
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
  )`);

  await runQuery(db, `CREATE TABLE IF NOT EXISTS election_positions (
    id VARCHAR(36) PRIMARY KEY,
    electionId VARCHAR(36) NOT NULL,
    positionId VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_election_position (electionId, positionId)
  )`);

  await runQuery(db, `CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default superadmin (password should be hashed in production)
  const superadminPassword = await bcrypt.hash('superadmin123', 10);
  await runQuery(db, `INSERT IGNORE INTO admins (id, username, password, role) VALUES (
    'superadmin-001', 'superadmin', '${superadminPassword}', 'superadmin'
  )`);

  // Ensure password column exists in voters table (for legacy DBs)
  const [passwordColumns] = await new Promise((resolve, reject) => {
    db.query(`SHOW COLUMNS FROM voters LIKE 'password'`, (err, result) => {
      if (err) reject(err);
      else resolve([result]);
    });
  });
  if (passwordColumns.length === 0) {
    await runQuery(db, `ALTER TABLE voters ADD COLUMN password VARCHAR(255)`);
  }

  // Ensure electionId column exists in votes table (for legacy DBs)
  const [electionIdColumns] = await new Promise((resolve, reject) => {
    db.query(`SHOW COLUMNS FROM votes LIKE 'electionId'`, (err, result) => {
      if (err) reject(err);
      else resolve([result]);
    });
  });
  if (electionIdColumns.length === 0) {
    // Create a legacy election for existing votes
    const legacyElectionId = 'legacy-election-001';
    await runQuery(db, `INSERT IGNORE INTO elections (id, title, description, startTime, endTime, status, created_by) VALUES (
      '${legacyElectionId}', 
      'Legacy Election', 
      'Default election for existing votes before election system was implemented', 
      '2024-01-01 00:00:00', 
      '2024-12-31 23:59:59', 
      'ended', 
      'superadmin-001'
    )`);
    
    // Add electionId column with the legacy election ID for existing votes
    await runQuery(db, `ALTER TABLE votes ADD COLUMN electionId VARCHAR(36) DEFAULT '${legacyElectionId}'`);
    
    // Update the unique constraint
    await runQuery(db, `ALTER TABLE votes DROP INDEX unique_vote`);
    await runQuery(db, `ALTER TABLE votes ADD UNIQUE KEY unique_vote (voterId, candidateId, electionId)`);
  }

  // 4. Create indexes safely (ignore errors if they already exist)
  try {
    await runQuery(db, `CREATE INDEX idx_candidates_position ON candidates(positionId)`);
  } catch (err) {
    // Index might already exist, ignore error
  }
  
  try {
    await runQuery(db, `CREATE INDEX idx_votes_voter ON votes(voterId)`);
  } catch (err) {
    // Index might already exist, ignore error
  }
  
  try {
    await runQuery(db, `CREATE INDEX idx_votes_candidate ON votes(candidateId)`);
  } catch (err) {
    // Index might already exist, ignore error
  }
  
  try {
    await runQuery(db, `CREATE INDEX idx_voters_email ON voters(email)`);
  } catch (err) {
    // Index might already exist, ignore error
  }
  
  try {
    await runQuery(db, `CREATE INDEX idx_voters_student_id ON voters(studentId)`);
  } catch (err) {
    // Index might already exist, ignore error
  }

  db.end();
}

// Ensure DB and tables before starting the app
ensureDatabaseAndTables()
  .then(() => {
    // Now connect to the DB for app usage
    const db = mysql.createConnection({ ...dbConfig, database: DB_NAME });
    app.use(express.json());
    app.use(cors());

    // Test endpoint
    app.get("/", (req, res) => {
      res.json("Voting System API is running!");
    });

    // ===== VOTING SYSTEM ENDPOINTS =====
    // Positions endpoints
    app.get("/api/positions", (req, res) => {
      const query = "SELECT * FROM positions ORDER BY name";
      db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
      });
    });

    app.post("/api/positions", (req, res) => {
      const query = "INSERT INTO positions (id, name, voteLimit) VALUES (?, ?, ?)";
      const values = [
        req.body.id,
        req.body.name,
        req.body.voteLimit
      ];
      db.query(query, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Position created successfully!", id: req.body.id });
      });
    });

    app.put("/api/positions/:id", (req, res) => {
      const positionId = req.params.id;
      const query = "UPDATE positions SET name = ?, voteLimit = ? WHERE id = ?";
      const values = [
        req.body.name,
        req.body.voteLimit,
        positionId
      ];
      db.query(query, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Position updated successfully!" });
      });
    });

    app.delete("/api/positions/:id", (req, res) => {
      const positionId = req.params.id;
      const query = "DELETE FROM positions WHERE id = ?";
      db.query(query, [positionId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Position deleted successfully!" });
      });
    });

    // Candidates endpoints
    app.get("/api/candidates", (req, res) => {
      const query = `
        SELECT c.*, p.name as positionName 
        FROM candidates c 
        LEFT JOIN positions p ON c.positionId = p.id 
        ORDER BY p.name, c.name
      `;
      db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Convert photoUrl to full URL if it's a filename
        const candidatesWithPhotoUrl = data.map(candidate => {
          if (candidate.photoUrl && !candidate.photoUrl.startsWith('http')) {
            candidate.photoUrl = `http://localhost:3000/uploads/${candidate.photoUrl}`;
          }
          return candidate;
        });
        
        return res.json(candidatesWithPhotoUrl);
      });
    });

    app.post("/api/candidates", upload.single('photo'), async (req, res) => {
      const { name, positionId, description } = req.body;
      const photoUrl = req.file ? req.file.filename : null;

      const query = "INSERT INTO candidates (id, name, positionId, photoUrl, description) VALUES (?, ?, ?, ?, ?)";
      const values = [
        req.body.id,
        name,
        positionId,
        photoUrl,
        description || null
      ];
      db.query(query, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Candidate created successfully!", id: req.body.id });
      });
    });

    app.put("/api/candidates/:id", upload.single('photo'), async (req, res) => {
      const candidateId = req.params.id;
      const { name, positionId, description } = req.body;
      
      // If a new photo was uploaded, use it; otherwise keep the existing one
      let photoUrl = req.body.photoUrl; // Keep existing if no new file
      if (req.file) {
        photoUrl = req.file.filename; // Store just the filename
      }
      
      const query = "UPDATE candidates SET name = ?, positionId = ?, photoUrl = ?, description = ? WHERE id = ?";
      const values = [
        name,
        positionId,
        photoUrl,
        description || null,
        candidateId
      ];
      db.query(query, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Candidate updated successfully!" });
      });
    });

    app.delete("/api/candidates/:id", (req, res) => {
      const candidateId = req.params.id;
      const query = "DELETE FROM candidates WHERE id = ?";
      db.query(query, [candidateId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Candidate deleted successfully!" });
      });
    });

    // Voters endpoints
    app.get("/api/voters", (req, res) => {
      const query = "SELECT * FROM voters ORDER BY name";
      db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
      });
    });

    app.post("/api/voters", async (req, res) => {
      const { name, email, studentId, password } = req.body;
      
      // If no password provided (admin-created voter), set a default password
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      } else {
        // Set default password as student ID for admin-created voters
        hashedPassword = await bcrypt.hash(studentId, 10);
      }
      
      const query = "INSERT INTO voters (name, email, studentId, password) VALUES (?, ?, ?, ?)";
      const values = [name, email, studentId, hashedPassword];
      
      db.query(query, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ 
          message: "Voter created successfully!", 
          id: data.insertId,
          defaultPassword: !password ? studentId : null // Return default password if none was provided
        });
      });
    });

    app.put("/api/voters/:id", (req, res) => {
      const voterId = req.params.id;
      const query = "UPDATE voters SET name = ?, email = ?, studentId = ?, hasVoted = ? WHERE id = ?";
      const values = [
        req.body.name,
        req.body.email,
        req.body.studentId,
        req.body.hasVoted,
        voterId
      ];
      db.query(query, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Voter updated successfully!" });
      });
    });

    app.delete("/api/voters/:id", (req, res) => {
      const voterId = req.params.id;
      const query = "DELETE FROM voters WHERE id = ?";
      db.query(query, [voterId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Voter deleted successfully!" });
      });
    });

    // Votes endpoints
    app.get("/api/votes", (req, res) => {
      const query = `
        SELECT v.id, v.voterId, v.candidateId, v.electionId, v.timestamp, vt.studentId, vt.name as voterName
        FROM votes v
        LEFT JOIN voters vt ON v.voterId = vt.id
        ORDER BY v.timestamp DESC
      `;
      db.query(query, (err, data) => {
        if (err) {
          // If the error is about missing electionId column, try without it
          if (err.message.includes('electionId')) {
            const fallbackQuery = `
              SELECT v.id, v.voterId, v.candidateId, v.timestamp, vt.studentId, vt.name as voterName
              FROM votes v
              LEFT JOIN voters vt ON v.voterId = vt.id
              ORDER BY v.timestamp DESC
            `;
            db.query(fallbackQuery, (fallbackErr, fallbackData) => {
              if (fallbackErr) return res.status(500).json({ error: fallbackErr.message });
              // Add default electionId for backward compatibility
              const dataWithElectionId = fallbackData.map(vote => ({
                ...vote,
                electionId: 'legacy-election-001'
              }));
              return res.json(dataWithElectionId);
            });
          } else {
            return res.status(500).json({ error: err.message });
          }
        } else {
          return res.json(data);
        }
      });
    });

    // Elections endpoints
    app.get("/api/elections", (req, res) => {
      const query = `
        SELECT e.*, a.username as createdByUsername,
        (SELECT COUNT(*) FROM election_positions ep WHERE ep.electionId = e.id) as positionCount
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        ORDER BY e.created_at DESC
      `;
      db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
      });
    });

    // Get active election for voting (MUST come before /:id route)
    app.get("/api/elections/active", (req, res) => {
      const query = `
        SELECT e.*, a.username as createdByUsername
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.status = 'active' 
        ORDER BY e.created_at DESC
        LIMIT 1
      `;
      db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data.length > 0 ? data[0] : null);
      });
    });

    app.get("/api/elections/:id", (req, res) => {
      const electionId = req.params.id;
      const query = `
        SELECT e.*, a.username as createdByUsername
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.id = ?
      `;
      db.query(query, [electionId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        if (data.length === 0) return res.status(404).json({ error: "Election not found" });
        return res.json(data[0]);
      });
    });

    app.get("/api/elections/:id/positions", (req, res) => {
      const electionId = req.params.id;
      const query = `
        SELECT p.*
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        WHERE ep.electionId = ?
        ORDER BY p.name
      `;
      db.query(query, [electionId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
      });
    });

    app.post("/api/elections", authenticate, requireRole(["admin", "superadmin"]), (req, res) => {
      const { title, description, startTime, endTime, positionIds } = req.body;
      const electionId = req.body.id;
      const createdBy = req.user.id;

      // Validate dates
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start >= end) {
        return res.status(400).json({ error: "End time must be after start time" });
      }

      // Convert dates to MySQL datetime format
      const mysqlStartTime = start.toISOString().slice(0, 19).replace('T', ' ');
      const mysqlEndTime = end.toISOString().slice(0, 19).replace('T', ' ');

      db.query("INSERT INTO elections (id, title, description, startTime, endTime, created_by) VALUES (?, ?, ?, ?, ?, ?)",
        [electionId, title, description, mysqlStartTime, mysqlEndTime, createdBy], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Add positions to election
        if (positionIds && positionIds.length > 0) {
          const positionValues = positionIds.map(posId => [crypto.randomUUID(), electionId, posId]);
          const positionQuery = "INSERT INTO election_positions (id, electionId, positionId) VALUES ?";
          db.query(positionQuery, [positionValues], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: "Election created successfully!", id: electionId });
          });
        } else {
          return res.json({ message: "Election created successfully!", id: electionId });
        }
      });
    });

    app.put("/api/elections/:id", authenticate, requireRole(["admin", "superadmin"]), (req, res) => {
      const electionId = req.params.id;
      const { title, description, startTime, endTime, status, positionIds } = req.body;

      // Validate dates
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start >= end) {
        return res.status(400).json({ error: "End time must be after start time" });
      }

      // Convert dates to MySQL datetime format
      const mysqlStartTime = start.toISOString().slice(0, 19).replace('T', ' ');
      const mysqlEndTime = end.toISOString().slice(0, 19).replace('T', ' ');

      db.query("UPDATE elections SET title = ?, description = ?, startTime = ?, endTime = ?, status = ? WHERE id = ?",
        [title, description, mysqlStartTime, mysqlEndTime, status, electionId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Update positions if provided
        if (positionIds) {
          // Remove existing positions
          db.query("DELETE FROM election_positions WHERE electionId = ?", [electionId], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Add new positions
            if (positionIds.length > 0) {
              const positionValues = positionIds.map(posId => [crypto.randomUUID(), electionId, posId]);
              const positionQuery = "INSERT INTO election_positions (id, electionId, positionId) VALUES ?";
              db.query(positionQuery, [positionValues], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.json({ message: "Election updated successfully!" });
              });
            } else {
              return res.json({ message: "Election updated successfully!" });
            }
          });
        } else {
          return res.json({ message: "Election updated successfully!" });
        }
      });
    });

    app.delete("/api/elections/:id", authenticate, requireRole(["admin", "superadmin"]), (req, res) => {
      const electionId = req.params.id;
      db.query("DELETE FROM elections WHERE id = ?", [electionId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Election deleted successfully!" });
      });
    });



    // Admin authentication endpoint (JWT-based)
    app.post("/api/admin/login", (req, res) => {
      const { username, password } = req.body;
      db.query("SELECT * FROM admins WHERE username=?", [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
        const admin = results[0];
        // Compare hashed password
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });
        // Create JWT
        const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: "8h" });
        res.json({ token, role: admin.role, id: admin.id });
      });
    });

    // User registration endpoint
    app.post("/api/user/register", async (req, res) => {
      const { name, email, studentId, password } = req.body;
      
      // Check if user already exists
      db.query("SELECT * FROM voters WHERE email = ? OR studentId = ?", [email, studentId], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
          return res.status(400).json({ error: "User with this email or student ID already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create voter account
        db.query("INSERT INTO voters (name, email, studentId, password) VALUES (?, ?, ?, ?)", 
          [name, email, studentId, hashedPassword], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // Create JWT token for immediate login
          const token = jwt.sign({ id: result.insertId, email, role: 'user' }, JWT_SECRET, { expiresIn: "8h" });
          res.json({ token, role: 'user', id: result.insertId, message: "Registration successful" });
        });
      });
    });

    // User login endpoint
    app.post("/api/user/login", async (req, res) => {
      const { studentId, password } = req.body;
      
      db.query("SELECT * FROM voters WHERE studentId = ?", [studentId], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
        
        const voter = results[0];
        
        // Check if voter has a password (for existing voters without passwords)
        if (!voter.password) {
          return res.status(401).json({ error: "Please register first or contact administrator" });
        }
        
        // Verify password
        const valid = await bcrypt.compare(password, voter.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });
        
        // Create JWT token
        const token = jwt.sign({ id: voter.id, email: voter.email, role: 'user' }, JWT_SECRET, { expiresIn: "8h" });
        res.json({ token, role: 'user', id: voter.id, message: "Login successful" });
      });
    });

    // Admin management endpoints (superadmin only)
    app.get("/api/admins", authenticate, requireRole("superadmin"), (req, res) => {
      db.query("SELECT id, username, role, created_at FROM admins", (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(data);
      });
    });

    app.post("/api/admins", authenticate, requireRole("superadmin"), async (req, res) => {
      const { id, username, password, role } = req.body;
      const hashed = await bcrypt.hash(password, 10);
      db.query("INSERT INTO admins (id, username, password, role) VALUES (?, ?, ?, ?)", [id, username, hashed, role], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Admin created" });
      });
    });

    app.put("/api/admins/:id", authenticate, requireRole("superadmin"), async (req, res) => {
      const { username, password, role } = req.body;
      const hashed = await bcrypt.hash(password, 10);
      db.query("UPDATE admins SET username=?, password=?, role=? WHERE id=?", [username, hashed, role, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Admin updated" });
      });
    });

    app.delete("/api/admins/:id", authenticate, requireRole("superadmin"), (req, res) => {
      db.query("DELETE FROM admins WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Admin deleted" });
      });
    });

    // Voting endpoint with lockout
    app.post("/api/votes", (req, res) => {
      const { voterId, candidateId, id, isLastVote } = req.body;
      
      // Log vote submission for traceability
      console.log(`Vote submission: ID=${id}, VoterID=${voterId}, CandidateID=${candidateId}, isLastVote=${isLastVote}`);
      console.log('Request body:', req.body);
      
      // First check if there's an active election
      db.query("SELECT id, status, startTime, endTime FROM elections WHERE status = 'active' LIMIT 1", (err, electionResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (electionResults.length === 0) return res.status(400).json({ error: "No active election found" });
        
        const election = electionResults[0];
        const electionId = election.id;
        console.log('Active election found:', election);
        
        // Check if election is active
        if (election.status !== 'active') {
          return res.status(403).json({ error: "Election is not active" });
        }
        
        // Get current timestamp for vote recording
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        // Check if voter has already completed voting (hasVoted flag)
        db.query("SELECT hasVoted FROM voters WHERE id = ?", [voterId], (err, voterResults) => {
          if (err) return res.status(500).json({ error: err.message });
          console.log('Voter query results:', voterResults);
          
          if (voterResults.length === 0) return res.status(404).json({ error: "Voter not found" });
          
          if (voterResults[0].hasVoted) {
            console.log(`Voter ${voterId} has already voted (hasVoted=${voterResults[0].hasVoted})`);
            return res.status(403).json({ error: "You have already voted in this election" });
          }
          
          console.log(`Voter ${voterId} has not voted yet, proceeding with vote recording`);
          
          // Record the vote
          db.query("INSERT INTO votes (id, voterId, candidateId, electionId, timestamp) VALUES (?, ?, ?, ?, ?)", 
            [id, voterId, candidateId, electionId, now], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            console.log(`Vote recorded successfully: ${id}`);
            
            // Only set hasVoted = true if this is the last vote
            if (isLastVote) {
              db.query("UPDATE voters SET hasVoted=TRUE WHERE id=?", [voterId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                console.log(`Voter ${voterId} locked out after completing all votes`);
                res.json({ message: "All votes recorded and voter locked out" });
              });
            } else {
              res.json({ message: "Vote recorded" });
            }
          });
        });
      });
    });

    // Debug endpoint to reset voter voting status (for testing)
    app.post("/api/debug/reset-voter/:voterId", (req, res) => {
      const voterId = req.params.voterId;
      db.query("UPDATE voters SET hasVoted=FALSE WHERE id=?", [voterId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Voter ${voterId} voting status reset` });
      });
    });

    // Debug endpoint to check voter status
    app.get("/api/debug/voter-status/:voterId", (req, res) => {
      const voterId = req.params.voterId;
      db.query("SELECT id, name, studentId, hasVoted FROM voters WHERE id=?", [voterId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Voter not found" });
        res.json(results[0]);
      });
    });

    // Results endpoint
    app.get("/api/results", (req, res) => {
      const query = `
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.photoUrl,
          COUNT(v.id) as voteCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId
        GROUP BY p.id, p.name, p.voteLimit, c.id, c.name, c.photoUrl
        ORDER BY p.name, voteCount DESC
      `;
      db.query(query, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
      });
    });

    app.listen(3000, () => {
      console.log('Voting System Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }); 