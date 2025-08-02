#!/usr/bin/env node

import { createConnection } from '../config/database.js';

console.log('🔧 Force fixing votes table constraint...');

const db = createConnection();

try {
  // First, try to drop the table and recreate it with the correct constraint
  console.log('   Dropping and recreating votes table with correct constraint...');
  
  await new Promise((resolve, reject) => {
    db.query('DROP TABLE IF EXISTS votes', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  console.log('   ✅ Dropped existing votes table');
  
  // Recreate the votes table with the correct constraint
  await new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE votes (
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
      )
    `;
    
    db.query(createTableSQL, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  console.log('   ✅ Recreated votes table with correct constraint');
  
  // Verify the constraint
  const verifyConstraint = await new Promise((resolve, reject) => {
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
  
  const verifyColumns = verifyConstraint.map(row => row.COLUMN_NAME);
  console.log('   Verified constraint columns:', verifyColumns);
  
  const expectedColumns = ['voterId', 'electionId', 'positionId', 'candidateId'];
  if (JSON.stringify(verifyColumns) === JSON.stringify(expectedColumns)) {
    console.log('✅ Votes table constraint fixed successfully!');
    console.log('   This now allows multiple votes per position while preventing duplicate candidate votes within a position');
  } else {
    throw new Error(`Constraint verification failed. Expected: ${expectedColumns}, Got: ${verifyColumns}`);
  }
  
} catch (error) {
  console.error('❌ Error fixing votes constraint:', error.message);
  process.exit(1);
} finally {
  db.end();
  process.exit(0);
} 