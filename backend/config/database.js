import mysql from "mysql2";
import bcrypt from "bcryptjs";

// Environment-based configuration
const NODE_ENV = 'development';
const IS_TEST = false;

// Database configuration
const DB_NAME = IS_TEST ? "voting_system_test" : "voting_system";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Create a connection without specifying database to create DB if needed
const dbRoot = mysql.createConnection({
  ...dbConfig,
  multipleStatements: true
});

// Connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  database: DB_NAME,
  connectionLimit: 10
});

// Helper to run a query and return a promise
function runQuery(connection, sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Test database connection
async function testConnection() {
  try {
    const connection = createConnection();
    await runQuery(connection, 'SELECT 1 as test');
    connection.end();
    return true;
  } catch (error) {
    return false;
  }
}

// Create database if it doesn't exist
async function createDatabase() {
  try {
    await runQuery(dbRoot, `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  } catch (error) {
    throw error;
  }
}

// Initialize tables with better error handling
async function createTables() {
  const db = createConnection();
  
  try {
    // Create tables in dependency order
    const tables = [
      {
        name: 'admins',
        sql: `CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(36) PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'departments',
        sql: `CREATE TABLE IF NOT EXISTS departments (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'courses',
        sql: `CREATE TABLE IF NOT EXISTS courses (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          departmentId VARCHAR(36) NOT NULL,
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'positions',
        sql: `CREATE TABLE IF NOT EXISTS positions (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          voteLimit INT NOT NULL DEFAULT 1,
          displayOrder INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'candidates',
        sql: `CREATE TABLE IF NOT EXISTS candidates (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          departmentId VARCHAR(36),
          courseId VARCHAR(36),
          photoUrl TEXT,
          description TEXT,
          displayOrder INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
          FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
        )`
      },
      {
        name: 'voters',
        sql: `CREATE TABLE IF NOT EXISTS voters (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          studentId VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255),
          departmentId VARCHAR(36),
          courseId VARCHAR(36),
          hasVoted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
          FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
        )`
      },
      {
        name: 'elections',
        sql: `CREATE TABLE IF NOT EXISTS elections (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          startTime DATETIME NOT NULL,
          endTime DATETIME NOT NULL,
          status ENUM('pending', 'active', 'paused', 'stopped', 'ended') DEFAULT 'pending',
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'election_positions',
        sql: `CREATE TABLE IF NOT EXISTS election_positions (
          id VARCHAR(36) PRIMARY KEY,
          electionId VARCHAR(36) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          UNIQUE KEY unique_election_position (electionId, positionId)
        )`
      },
      {
        name: 'election_candidates',
        sql: `CREATE TABLE IF NOT EXISTS election_candidates (
          id VARCHAR(36) PRIMARY KEY,
          electionId VARCHAR(36) NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
          UNIQUE KEY unique_election_candidate (electionId, candidateId)
        )`
      },
      {
        name: 'votes',
        sql: `CREATE TABLE IF NOT EXISTS votes (
          id VARCHAR(36) PRIMARY KEY,
          voterId INT NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          electionId VARCHAR(36) NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (voterId) REFERENCES voters(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          UNIQUE KEY unique_vote (voterId, candidateId, electionId)
        )`
      },
      {
        name: 'password_reset_tokens',
        sql: `CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          user_type ENUM('voter', 'admin') NOT NULL,
          token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_token (token),
          INDEX idx_user_type (user_type),
          INDEX idx_expires_at (expires_at)
        )`
      }
    ];

    for (const table of tables) {
      try {
        await runQuery(db, table.sql);
      } catch (error) {
        throw error;
      }
    }

    // Create indexes
    const indexes = [
      { name: 'idx_candidates_position', sql: 'CREATE INDEX idx_candidates_position ON candidates(positionId)' },
      { name: 'idx_votes_voter', sql: 'CREATE INDEX idx_votes_voter ON votes(voterId)' },
      { name: 'idx_votes_candidate', sql: 'CREATE INDEX idx_votes_candidate ON votes(candidateId)' },
      { name: 'idx_votes_election', sql: 'CREATE INDEX idx_votes_election ON votes(electionId)' },
      { name: 'idx_voters_email', sql: 'CREATE INDEX idx_voters_email ON voters(email)' },
      { name: 'idx_voters_student_id', sql: 'CREATE INDEX idx_voters_student_id ON voters(studentId)' },
      { name: 'idx_admins_email', sql: 'CREATE INDEX idx_admins_email ON admins(email)' },
      { name: 'idx_elections_status', sql: 'CREATE INDEX idx_elections_status ON elections(status)' },
      { name: 'idx_elections_time', sql: 'CREATE INDEX idx_elections_time ON elections(startTime, endTime)' }
    ];

    for (const index of indexes) {
      try {
        await runQuery(db, index.sql);
      } catch (error) {
        // Index might already exist, ignore error
      }
    }

    db.end();
  } catch (error) {
    db.end();
    throw error;
  }
}

// Insert default data
async function insertDefaultData() {
  const db = createConnection();
  
  try {
    // Import and run comprehensive seed data
    const { seedDatabase } = await import('../scripts/seed-data.js');
    await seedDatabase();
    
    db.end();
  } catch (error) {
    db.end();
    throw error;
  }
}

// Main initialization function
async function ensureDatabaseAndTables() {
  try {
    // Test connection first
    const connectionOk = await testConnection();
    if (!connectionOk) {
      throw new Error('Database connection failed');
    }

    // Create database
    await createDatabase();

    // Create tables
    await createTables();

    // Insert default data
    await insertDefaultData();

  } catch (error) {
    throw error;
  }
}

// Create database connection for app usage
function createConnection() {
  return mysql.createConnection({ ...dbConfig, database: DB_NAME });
}

// Get connection from pool
function getPoolConnection() {
  return pool.getConnection();
}

// Close pool connections
function closePool() {
  return new Promise((resolve) => {
    pool.end((err) => {
      resolve();
    });
  });
}

export { 
  ensureDatabaseAndTables, 
  createConnection, 
  getPoolConnection,
  closePool,
  runQuery,
  testConnection,
  DB_NAME,
  IS_TEST 
}; 