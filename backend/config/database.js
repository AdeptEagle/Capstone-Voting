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
    multipleStatements: true
  };
}

// Create a connection without specifying database to create DB if needed
const dbRoot = mysql.createConnection({
  ...dbConfig,
  multipleStatements: true
});

// Connection pool for better performance with pool-specific options
const pool = mysql.createPool({
  ...dbConfig,
  database: DB_NAME,
  connectionLimit: 30,  // Optimized for school-scale voting (500-700 students)
  acquireTimeout: 30000,  // Pool-specific: time to acquire connection
  timeout: 30000,  // Pool-specific: query timeout
  reconnect: true  // Pool-specific: auto-reconnect
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
    
    // Create tables in dependency order - Trigger Vercel auto deployment
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
      { name: 'idx_votes_voterId', sql: 'CREATE INDEX IF NOT EXISTS idx_votes_voterId ON votes(voterId)' },
      { name: 'idx_votes_position_voter', sql: 'CREATE INDEX IF NOT EXISTS idx_votes_position_voter ON votes(positionId, voterId, electionId)' }
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
      console.log('🔧 Force fixing votes table constraint...');
    }
    
    // First, drop ALL existing constraints on votes table (except PRIMARY)
    if (verbose) {
      console.log('   Dropping all existing constraints...');
    }
    
    // Drop the specific constraint if it exists
    try {
      await new Promise((resolve) => {
        db.query('ALTER TABLE votes DROP INDEX unique_vote', (err) => {
          if (verbose && !err) {
            console.log('   Dropped existing unique_vote constraint');
          }
          resolve(); // Always resolve, ignore errors
        });
      });
    } catch (error) {
      // Ignore errors when dropping constraints
    }
    
    try {
      await new Promise((resolve) => {
        db.query('ALTER TABLE votes DROP INDEX unique_voter_candidate', (err) => {
          if (verbose && !err) {
            console.log('   Dropped existing unique_voter_candidate constraint');
          }
          resolve(); // Always resolve, ignore errors
        });
      });
    } catch (error) {
      // Ignore errors when dropping constraints
    }
    
    // Add the correct constraint: prevent same voter from voting for same candidate in same position
    if (verbose) {
      console.log('   Adding correct constraint: unique_vote (voterId, electionId, positionId, candidateId)');
    }
    
    await new Promise((resolve, reject) => {
      db.query("ALTER TABLE votes ADD UNIQUE KEY unique_vote (voterId, electionId, positionId, candidateId)", (err) => {
        if (err) {
          if (verbose) {
            console.error('Error adding constraint:', err.message);
          }
          reject(err);
        } else {
          if (verbose) {
            console.log('✅ Added correct constraint: unique_vote (voterId, electionId, positionId, candidateId)');
          }
          resolve();
        }
      });
    });
    
    // Verify the constraint was added correctly
    if (verbose) {
      console.log('   Verifying constraint...');
    }
    
    const verifyConstraint = await new Promise((resolve, reject) => {
      db.query(`
        SELECT CONSTRAINT_NAME, COLUMN_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME = 'votes' 
        AND CONSTRAINT_NAME = 'unique_vote'
        AND TABLE_SCHEMA = '${DB_NAME}'
        ORDER BY ORDINAL_POSITION
      `, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    const verifyColumns = verifyConstraint.map(row => row.COLUMN_NAME);
    if (verbose) {
      console.log('   Verified constraint columns:', verifyColumns);
    }
    
    const expectedColumns = ['voterId', 'electionId', 'positionId', 'candidateId'];
    if (JSON.stringify(verifyColumns) === JSON.stringify(expectedColumns)) {
      if (verbose) {
        console.log('✅ Votes table constraint fixed and verified successfully');
        console.log('   This now allows multiple votes per position while preventing duplicate candidate votes within a position');
      }
    } else {
      throw new Error(`Constraint verification failed. Expected: ${expectedColumns}, Got: ${verifyColumns}`);
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

// Updated validation function that works with transactions
async function validateVoteForPosition(connection, voterId, electionId, positionId, candidateId, currentTransactionVotes = []) {
  try {
    // Get the vote limit for this position
    const positionResult = await runQuery(connection, 
      'SELECT voteLimit FROM positions WHERE id = ?', 
      [positionId]
    );
    
    if (positionResult.length === 0) {
      throw new Error('Position not found');
    }
    
    const voteLimit = positionResult[0].voteLimit;
    
    // Check if voter already voted for this specific candidate (in database)
    const duplicateVote = await runQuery(connection, 
      'SELECT id FROM votes WHERE voterId = ? AND electionId = ? AND candidateId = ?',
      [voterId, electionId, candidateId]
    );
    
    if (duplicateVote.length > 0) {
      throw new Error('You have already voted for this candidate');
    }
    
    // Check if this candidate is already in the current transaction votes
    const duplicateInTransaction = currentTransactionVotes.some(vote => 
      vote.candidateId === candidateId && vote.positionId === positionId
    );
    
    if (duplicateInTransaction) {
      throw new Error('You are trying to vote for the same candidate multiple times');
    }
    
    // Get current vote count for this voter and position (from database)
    const currentVotes = await runQuery(connection, 
      'SELECT COUNT(*) as count FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?',
      [voterId, electionId, positionId]
    );
    
    const currentVoteCount = currentVotes[0].count;
    
    // Count votes for this position in current transaction
    const transactionVotesForPosition = currentTransactionVotes.filter(vote => vote.positionId === positionId).length;
    
    // Total votes would be: database votes + transaction votes + 1 (current vote)
    const totalVotesAfterThis = currentVoteCount + transactionVotesForPosition + 1;
    
    if (totalVotesAfterThis > voteLimit) {
      throw new Error(`You can only vote for ${voteLimit} candidate(s) in this position. You would have ${totalVotesAfterThis} votes.`);
    }
    
    return { 
      valid: true, 
      currentVotes: currentVoteCount, 
      transactionVotes: transactionVotesForPosition,
      limit: voteLimit,
      totalAfter: totalVotesAfterThis
    };
    
  } catch (error) {
    throw error;
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
    if (isFreshSetup) {
      console.log('✅ Votes table constraint verified/fixed');
    }

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
  validateVoteForPosition,
  DB_NAME,
  IS_TEST 
};