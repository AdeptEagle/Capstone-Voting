import mysql from "mysql2";
import bcrypt from "bcryptjs";

const DB_NAME = "voting_system";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root"
};

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
  try {
    // 1. Create database if it doesn't exist
    await runQuery(dbRoot, `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

    // 2. Connect to the database
    const db = mysql.createConnection({ ...dbConfig, database: DB_NAME });

    // 3. Create tables if they do not exist
    await runQuery(db, `CREATE TABLE IF NOT EXISTS positions (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      voteLimit INT NOT NULL DEFAULT 1,
      displayOrder INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await runQuery(db, `CREATE TABLE IF NOT EXISTS candidates (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      positionId VARCHAR(36) NOT NULL,
      photoUrl TEXT,
      description TEXT,
      displayOrder INT NOT NULL DEFAULT 0,
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
      voterGroupId VARCHAR(36),
      hasVoted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (voterGroupId) REFERENCES voter_groups(id) ON DELETE SET NULL
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

    await runQuery(db, `CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await runQuery(db, `CREATE TABLE IF NOT EXISTS voter_groups (
      id VARCHAR(20) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      type ENUM('department', 'class', 'year', 'custom') NOT NULL DEFAULT 'custom',
      created_by VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
    )`);

    await runQuery(db, `CREATE TABLE IF NOT EXISTS voter_group_members (
      id VARCHAR(36) PRIMARY KEY,
      voterGroupId VARCHAR(36) NOT NULL,
      voterId INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (voterGroupId) REFERENCES voter_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (voterId) REFERENCES voters(id) ON DELETE CASCADE,
      UNIQUE KEY unique_voter_group_member (voterGroupId, voterId)
    )`);

    await runQuery(db, `CREATE TABLE IF NOT EXISTS elections (
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

    // Add voterGroupId column to voters table if it doesn't exist
    const [voterGroupIdColumns] = await new Promise((resolve, reject) => {
      db.query(`SHOW COLUMNS FROM voters LIKE 'voterGroupId'`, (err, result) => {
        if (err) reject(err);
        else resolve([result]);
      });
    });
    if (voterGroupIdColumns.length === 0) {
      await runQuery(db, `ALTER TABLE voters ADD COLUMN voterGroupId VARCHAR(20)`);
      // Add foreign key constraint if voter_groups table exists
      try {
        await runQuery(db, `ALTER TABLE voters ADD CONSTRAINT fk_voters_group FOREIGN KEY (voterGroupId) REFERENCES voter_groups(id) ON DELETE SET NULL`);
      } catch (error) {
        console.log('Foreign key constraint will be added when voter_groups table is created');
      }
    }

    // Add displayOrder columns to existing tables if they don't exist
    const [positionDisplayOrderColumns] = await new Promise((resolve, reject) => {
      db.query(`SHOW COLUMNS FROM positions LIKE 'displayOrder'`, (err, result) => {
        if (err) reject(err);
        else resolve([result]);
      });
    });
    if (positionDisplayOrderColumns.length === 0) {
      await runQuery(db, `ALTER TABLE positions ADD COLUMN displayOrder INT NOT NULL DEFAULT 0`);
      console.log('Added displayOrder column to positions table');
    }

    const [candidateDisplayOrderColumns] = await new Promise((resolve, reject) => {
      db.query(`SHOW COLUMNS FROM candidates LIKE 'displayOrder'`, (err, result) => {
        if (err) reject(err);
        else resolve([result]);
      });
    });
    if (candidateDisplayOrderColumns.length === 0) {
      await runQuery(db, `ALTER TABLE candidates ADD COLUMN displayOrder INT NOT NULL DEFAULT 0`);
      console.log('Added displayOrder column to candidates table');
    }

    // Migrate existing election statuses to new enum values
    try {
      await runQuery(db, `UPDATE elections SET status = 'pending' WHERE status = 'draft'`);
      await runQuery(db, `UPDATE elections SET status = 'stopped' WHERE status = 'cancelled'`);
    } catch (error) {
      console.log('Status migration completed or not needed');
    }

    // Fix status column if it has wrong definition
    try {
      await runQuery(db, `ALTER TABLE elections MODIFY COLUMN status ENUM('pending', 'active', 'paused', 'stopped', 'ended') DEFAULT 'pending'`);
      console.log('Status column updated successfully');
    } catch (error) {
      console.log('Status column update failed or not needed:', error.message);
    }

    // Update any null status values to 'pending'
    try {
      await runQuery(db, `UPDATE elections SET status = 'pending' WHERE status IS NULL`);
      console.log('Null status values updated to pending');
    } catch (error) {
      console.log('Null status update failed or not needed:', error.message);
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
    console.log('Database and tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Create database connection for app usage
function createConnection() {
  return mysql.createConnection({ ...dbConfig, database: DB_NAME });
}

export { ensureDatabaseAndTables, createConnection, runQuery }; 