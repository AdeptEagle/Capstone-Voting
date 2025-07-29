import { createConnection } from "../config/database.js";

async function migrateCustomIDs() {
  const db = createConnection();
  
  try {
    console.log('🔄 Starting Custom ID Migration...');
    console.log('=====================================');
    
    // Step 1: Backup existing data
    console.log('\n📋 Step 1: Backing up existing data...');
    
    const elections = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM elections', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const electionPositions = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM election_positions', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const electionCandidates = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM election_candidates', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const votes = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM votes', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log(`✅ Backed up ${elections.length} elections`);
    console.log(`✅ Backed up ${electionPositions.length} election positions`);
    console.log(`✅ Backed up ${electionCandidates.length} election candidates`);
    console.log(`✅ Backed up ${votes.length} votes`);
    
    // Step 2: Drop and recreate tables with new schema
    console.log('\n📋 Step 2: Recreating tables with new ID format...');
    
    // Drop tables in reverse dependency order
    await new Promise((resolve, reject) => {
      db.query('DROP TABLE IF EXISTS votes', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      db.query('DROP TABLE IF EXISTS election_candidates', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      db.query('DROP TABLE IF EXISTS election_positions', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      db.query('DROP TABLE IF EXISTS elections', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Dropped existing tables');
    
    // Recreate tables with new schema
    console.log('Creating tables with new ID format...');
    
    // Create elections table
    await new Promise((resolve, reject) => {
      db.query(`
        CREATE TABLE IF NOT EXISTS elections (
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
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Create election_positions table
    await new Promise((resolve, reject) => {
      db.query(`
        CREATE TABLE IF NOT EXISTS election_positions (
          id VARCHAR(20) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Create election_candidates table
    await new Promise((resolve, reject) => {
      db.query(`
        CREATE TABLE IF NOT EXISTS election_candidates (
          id VARCHAR(20) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Create votes table
    await new Promise((resolve, reject) => {
      db.query(`
        CREATE TABLE IF NOT EXISTS votes (
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
          UNIQUE KEY unique_vote (electionId, positionId, voterId)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Recreated tables with new ID format');
    
    // Step 3: Migrate data with new IDs
    console.log('\n📋 Step 3: Migrating data with new custom IDs...');
    
    // Migrate elections
    for (let i = 0; i < elections.length; i++) {
      const election = elections[i];
      const newId = `ELEC-${i + 1}`;
      
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO elections (id, title, description, startTime, endTime, status, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [newId, election.title, election.description, election.startTime, election.endTime, election.status, election.created_by, election.created_at, election.updated_at],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      console.log(`✅ Migrated election: "${election.title}" → ${newId}`);
    }
    
    // Migrate election positions
    for (let i = 0; i < electionPositions.length; i++) {
      const ep = electionPositions[i];
      const newId = `ELEC-POS-${i + 1}`;
      
      // Find the new election ID
      const electionIndex = elections.findIndex(e => e.id === ep.electionId);
      const newElectionId = electionIndex >= 0 ? `ELEC-${electionIndex + 1}` : ep.electionId;
      
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO election_positions (id, electionId, positionId, created_at) VALUES (?, ?, ?, ?)',
          [newId, newElectionId, ep.positionId, ep.created_at],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      console.log(`✅ Migrated election position: ${newId} → Election: ${newElectionId}`);
    }
    
    // Migrate election candidates
    for (let i = 0; i < electionCandidates.length; i++) {
      const ec = electionCandidates[i];
      const newId = `ELEC-CAND-${i + 1}`;
      
      // Find the new election ID
      const electionIndex = elections.findIndex(e => e.id === ec.electionId);
      const newElectionId = electionIndex >= 0 ? `ELEC-${electionIndex + 1}` : ec.electionId;
      
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO election_candidates (id, electionId, candidateId, created_at) VALUES (?, ?, ?, ?)',
          [newId, newElectionId, ec.candidateId, ec.created_at],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      console.log(`✅ Migrated election candidate: ${newId} → Election: ${newElectionId}`);
    }
    
    // Migrate votes
    for (let i = 0; i < votes.length; i++) {
      const vote = votes[i];
      const newId = `VOTE-${i + 1}`;
      
      // Find the new election ID
      const electionIndex = elections.findIndex(e => e.id === vote.electionId);
      const newElectionId = electionIndex >= 0 ? `ELEC-${electionIndex + 1}` : vote.electionId;
      
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO votes (id, electionId, positionId, candidateId, voterId, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [newId, newElectionId, vote.positionId, vote.candidateId, vote.voterId, vote.created_at],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      console.log(`✅ Migrated vote: ${newId} → Election: ${newElectionId}`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('=====================================');
    console.log('✅ All tables updated with custom identifiable IDs');
    console.log('✅ Data migrated with new ID format');
    console.log('✅ Foreign key relationships maintained');
    
    // Show final results
    const finalElections = await new Promise((resolve, reject) => {
      db.query('SELECT id, title FROM elections', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📊 Final Results:');
    console.log('==================');
    finalElections.forEach((election, index) => {
      console.log(`${index + 1}. ID: "${election.id}" → Title: "${election.title}"`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    db.end();
  }
}

// Run the migration
migrateCustomIDs(); 