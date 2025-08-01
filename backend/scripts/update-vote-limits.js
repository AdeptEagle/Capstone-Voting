#!/usr/bin/env node

import mysql from 'mysql2/promise';

console.log('🔧 Updating Vote Limits and Constraints');
console.log('=====================================\n');

// Database configuration - use environment variables
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "root",
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "voting_system",
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function updateVoteLimits() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    // Drop the old constraint
    console.log('🗑️ Dropping old unique_vote constraint...');
    try {
      await connection.execute('ALTER TABLE votes DROP INDEX unique_vote');
      console.log('✅ Old constraint dropped');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️ No old constraint found to drop');
      } else {
        throw error;
      }
    }
    
    // Add new constraint that only prevents voting for the same candidate twice
    console.log('➕ Adding new unique_vote constraint...');
    await connection.execute(`
      ALTER TABLE votes 
      ADD UNIQUE KEY unique_vote (voterId, electionId, candidateId)
    `);
    console.log('✅ New constraint added successfully');
    
    // Add index for vote counting
    console.log('➕ Adding index for vote counting...');
    try {
      await connection.execute(`
        ALTER TABLE votes 
        ADD INDEX idx_vote_count (voterId, electionId, positionId)
      `);
      console.log('✅ Vote counting index added');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Vote counting index already exists');
      } else {
        throw error;
      }
    }
    
    console.log('\n✅ Vote limits update completed successfully!');
    console.log('📊 The system now correctly handles multiple votes per position');
    
  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the update
updateVoteLimits();