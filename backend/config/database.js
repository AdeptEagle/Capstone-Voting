import mysql from "mysql2";
import bcrypt from "bcryptjs";

// Environment-based configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_TEST = false;

// Database configuration - use Railway MySQL plugin variables directly
const DB_NAME = process.env.MYSQLDATABASE || process.env.DB_NAME || (IS_TEST ? "voting_system_test" : "voting_system");

// Parse MYSQL_URL if available, otherwise use individual variables
let dbConfig;
if (process.env.MYSQL_URL) {
  // Parse MySQL URL (mysql://user:password@host:port/database)
  const url = new URL(process.env.MYSQL_URL);
  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    port: parseInt(url.port) || 3306,
    charset: process.env.DB_CHARSET || 'utf8mb4',
    timezone: process.env.DB_TIMEZONE || '+00:00',
    // Connection pool settings for better ACID support
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    multipleStatements: true
  };
} else {
  // Fallback to individual environment variables
  dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "root",
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
    charset: process.env.DB_CHARSET || 'utf8mb4',
    timezone: process.env.DB_TIMEZONE || '+00:00',
    // Connection pool settings for better ACID support
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    multipleStatements: true
  };
}

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

// Test MySQL server connection (without specific database)
async function testMySQLConnection() {
  try {
    console.log('🔍 Testing MySQL connection...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Database: ${DB_NAME}`);
    
    const connection = mysql.createConnection({
      ...dbConfig,
      multipleStatements: true
    });
    await runQuery(connection, 'SELECT 1 as test');
    connection.end();
    console.log('✅ MySQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
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
async function createDatabase(verbose = true) {
  try {
    if (verbose) {
      console.log(`   Creating database: ${DB_NAME}`);
    }
    await runQuery(dbRoot, `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    if (verbose) {
      console.log(`   ✅ Database ${DB_NAME} created/verified`);
    }
  } catch (error) {
    if (verbose) {
      console.error(`   ❌ Error creating database ${DB_NAME}:`, error.message);
    }
    throw error;
  }
}

// Initialize tables with better error handling
async function createTables(verbose = true) {
  const db = createConnection();
  
  try {
    if (verbose) {
      console.log('🏗️ Creating database tables...');
    }
    
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
          photoUrl MEDIUMTEXT,
          description TEXT,
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
          id VARCHAR(20) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          startTime DATETIME NOT NULL,
          endTime DATETIME NOT NULL,
          status ENUM('pending', 'active', 'paused', 'stopped', 'ended', 'cancelled') DEFAULT 'pending',
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'election_positions',
        sql: `CREATE TABLE IF NOT EXISTS election_positions (
          id VARCHAR(20) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'election_candidates',
        sql: `CREATE TABLE IF NOT EXISTS election_candidates (
          id VARCHAR(20) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'votes',
        sql: `CREATE TABLE IF NOT EXISTS votes (
          id VARCHAR(20) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          voterId INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
          FOREIGN KEY (voterId) REFERENCES voters(id) ON DELETE CASCADE,
          UNIQUE KEY unique_vote (voterId, electionId, positionId, candidateId)
        )`
      },
      {
        name: 'password_reset_tokens',
        sql: `CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          token VARCHAR(255) NOT NULL UNIQUE,
          user_type ENUM('voter', 'admin') NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      }
    ];

    // Create each table
    for (const table of tables) {
      try {
        if (verbose) {
          console.log(`   Creating table: ${table.name}`);
        }
        await runQuery(db, table.sql);
        if (verbose) {
          console.log(`   ✅ Table ${table.name} created successfully`);
        }
      } catch (error) {
        if (verbose) {
          console.error(`   ❌ Error creating table ${table.name}:`, error.message);
        }
        throw error;
      }
    }

    // Create indexes for better performance
    const indexes = [
      { name: 'idx_voters_email', sql: 'CREATE INDEX IF NOT EXISTS idx_voters_email ON voters(email)' },
      { name: 'idx_voters_studentId', sql: 'CREATE INDEX IF NOT EXISTS idx_voters_studentId ON voters(studentId)' },
      { name: 'idx_candidates_positionId', sql: 'CREATE INDEX IF NOT EXISTS idx_candidates_positionId ON candidates(positionId)' },
      { name: 'idx_courses_departmentId', sql: 'CREATE INDEX IF NOT EXISTS idx_courses_departmentId ON courses(departmentId)' },
      { name: 'idx_election_positions_electionId', sql: 'CREATE INDEX IF NOT EXISTS idx_election_positions_electionId ON election_positions(electionId)' },
      { name: 'idx_election_candidates_electionId', sql: 'CREATE INDEX IF NOT EXISTS idx_election_candidates_electionId ON election_candidates(electionId)' },
      { name: 'idx_votes_electionId', sql: 'CREATE INDEX IF NOT EXISTS idx_votes_electionId ON votes(electionId)' },
      { name: 'idx_votes_voterId', sql: 'CREATE INDEX IF NOT EXISTS idx_votes_voterId ON votes(voterId)' }
    ];

    // Create indexes silently (they might already exist)
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
async function insertDefaultData(verbose = true) {
  const db = createConnection();
  
  try {
    // Import and run clean default seed data
    const { seedWithCleanData } = await import('../scripts/clean-seed-data.js');
    await seedWithCleanData(db, verbose);
    
    db.end();
  } catch (error) {
    db.end();
    throw error;
  }
}

// Check if database and tables already exist
async function checkDatabaseExists() {
  try {
    // Connect without specifying database to check if it exists
    const connection = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${DB_NAME}'`);
    connection.end();
    
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking database existence:', error);
    return false;
  }
}

// Fix votes table constraint for existing databases
async function fixVotesTableConstraint(verbose = true) {
  const db = createConnection();
  
  try {
    if (verbose) {
      console.log('🔧 Checking votes table constraint...');
    }
    
    // Check if the correct constraint exists
    const constraintCheck = await new Promise((resolve, reject) => {
      db.query(`
        SELECT CONSTRAINT_NAME, COLUMN_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME = 'votes' 
        AND CONSTRAINT_NAME = 'unique_vote'
        ORDER BY ORDINAL_POSITION
      `, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    const expectedColumns = ['voterId', 'electionId', 'positionId', 'candidateId'];
    const actualColumns = constraintCheck.map(row => row.COLUMN_NAME);
    
    console.log('Current constraint columns:', actualColumns);
    console.log('Expected constraint columns:', expectedColumns);
    
    // If constraint is correct, no action needed
    if (JSON.stringify(actualColumns) === JSON.stringify(expectedColumns)) {
      if (verbose) {
        console.log('✅ Votes table constraint is already correct');
      }
      return;
    }
    
    // Fix the constraint
    if (verbose) {
      console.log('🔧 Fixing votes table constraint...');
    }
    
    // Drop existing constraint if it exists
    try {
      await new Promise((resolve, reject) => {
        db.query("ALTER TABLE votes DROP INDEX unique_vote", (err) => {
          if (err && err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      // Constraint might not exist, continue
    }
    
    // Add correct constraint
    await new Promise((resolve, reject) => {
      db.query("ALTER TABLE votes ADD UNIQUE KEY unique_vote (voterId, electionId, positionId, candidateId)", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    if (verbose) {
      console.log('✅ Votes table constraint fixed successfully');
    }
    
  } catch (error) {
    if (verbose) {
      console.error('❌ Error fixing votes constraint:', error.message);
    }
    // Don't throw error - this is not critical for server startup
  } finally {
    db.end();
  }
}

// Check if tables exist
async function checkTablesExist() {
  try {
    const connection = createConnection();
    const result = await runQuery(connection, 'SHOW TABLES');
    connection.end();
    return result.length > 0;
  } catch (error) {
    return false;
  }
}

// Main initialization function
async function ensureDatabaseAndTables() {
  try {
    // Check if database and tables already exist
    const dbExists = await checkDatabaseExists();
    const tablesExist = await checkTablesExist();
    
    // Only show verbose logging if this is a fresh setup
    const isFreshSetup = !dbExists || !tablesExist;
    
    if (isFreshSetup) {
      console.log('🚀 Initializing database and tables...');
    }
    
    // Test MySQL server connection first (without specific database)
    if (isFreshSetup) {
      console.log('🔍 Testing MySQL server connection...');
    }
    const mysqlConnectionOk = await testMySQLConnection();
    if (!mysqlConnectionOk) {
      throw new Error('MySQL server connection failed. Make sure MySQL is running.');
    }
    if (isFreshSetup) {
      console.log('✅ MySQL server connection successful');
    }

    // Create database
    if (isFreshSetup) {
      console.log('🗄️ Creating database...');
    }
    await createDatabase(isFreshSetup);
    if (isFreshSetup) {
      console.log('✅ Database created/verified');
    }

    // Test database connection after creation
    if (isFreshSetup) {
      console.log('🔍 Testing database connection...');
    }
    const dbConnectionOk = await testConnection();
    if (!dbConnectionOk) {
      throw new Error('Database connection failed after creation');
    }
    if (isFreshSetup) {
      console.log('✅ Database connection successful');
    }

    // Create tables
    if (isFreshSetup) {
      await createTables(isFreshSetup);
      console.log('✅ All tables created successfully');
    } else {
      // Silent table creation for existing databases
      await createTables(false);
    }

    // Always seed with default data (this will update existing data if needed)
    await insertDefaultData(isFreshSetup);

    // Fix votes table constraint for ALL databases (fresh and existing)
    await fixVotesTableConstraint(isFreshSetup);
    console.log('✅ Votes table constraint verified/fixed');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
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
  testMySQLConnection,
  DB_NAME,
  IS_TEST 
}; 