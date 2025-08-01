#!/usr/bin/env node

import mysql from 'mysql2/promise';

console.log('🔧 Updating Vote Handling');
console.log('========================\n');

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

async function updateVoteHandling() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    // Drop existing constraints and indexes
    console.log('🗑️ Dropping existing constraints and indexes...');
    try {
      await connection.execute('ALTER TABLE votes DROP INDEX unique_vote');
      console.log('✅ Dropped unique_vote constraint');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️ No unique_vote constraint found');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute('ALTER TABLE votes DROP INDEX idx_vote_count');
      console.log('✅ Dropped idx_vote_count index');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️ No idx_vote_count index found');
      } else {
        throw error;
      }
    }
    
    // Add new indexes for vote counting and uniqueness
    console.log('\n➕ Adding new indexes...');
    
    // Index for counting votes per position
    await connection.execute(`
      CREATE INDEX idx_vote_count 
      ON votes (voterId, electionId, positionId)
    `);
    console.log('✅ Added vote counting index');
    
    // Index for preventing duplicate votes for the same candidate
    await connection.execute(`
      ALTER TABLE votes 
      ADD UNIQUE KEY unique_vote (voterId, electionId, candidateId)
    `);
    console.log('✅ Added unique vote constraint');
    
    // Add index for election results
    await connection.execute(`
      CREATE INDEX idx_election_results 
      ON votes (electionId, positionId, candidateId)
    `);
    console.log('✅ Added election results index');
    
    console.log('\n✅ Vote handling update completed successfully!');
    console.log('📊 The system now supports:');
    console.log('  - Multiple votes per position (up to position limit)');
    console.log('  - Prevents duplicate votes for the same candidate');
    console.log('  - Optimized vote counting and results queries');
    
  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the update
updateVoteHandling();