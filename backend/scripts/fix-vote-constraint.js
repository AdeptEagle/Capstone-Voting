#!/usr/bin/env node

import mysql from 'mysql2/promise';

console.log('🔧 Fixing Votes Table Unique Constraint');
console.log('=======================================\n');

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

async function fixVoteConstraint() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    // Check current constraint
    console.log('📋 Checking current votes table structure...');
    const [constraints] = await connection.execute(`
      SELECT CONSTRAINT_NAME, COLUMN_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'votes' AND CONSTRAINT_NAME = 'unique_vote'
    `, [dbConfig.database]);
    
    console.log('Current unique_vote constraint columns:', constraints.map(c => c.COLUMN_NAME));
    
    // Drop the old constraint if it exists
    if (constraints.length > 0) {
      console.log('🗑️ Dropping old unique_vote constraint...');
      await connection.execute('ALTER TABLE votes DROP INDEX unique_vote');
      console.log('✅ Old constraint dropped');
    }
    
    // Add the new constraint with candidateId
    console.log('➕ Adding new unique_vote constraint with candidateId...');
    try {
      // First try to add the constraint directly
      await connection.execute(`
        ALTER TABLE votes 
        ADD UNIQUE KEY unique_vote (voterId, electionId, positionId, candidateId)
      `);
    } catch (addError) {
      if (addError.code === 'ER_DUP_KEYNAME') {
        // If constraint exists, drop and recreate it
        console.log('🔄 Constraint exists, recreating it...');
        await connection.execute('ALTER TABLE votes DROP INDEX unique_vote');
        await connection.execute(`
          ALTER TABLE votes 
          ADD UNIQUE KEY unique_vote (voterId, electionId, positionId, candidateId)
        `);
      } else {
        throw addError;
      }
    }
    console.log('✅ New constraint added successfully');
    
    // Verify the new constraint
    console.log('🔍 Verifying new constraint...');
    const [newConstraints] = await connection.execute(`
      SELECT CONSTRAINT_NAME, COLUMN_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'votes' AND CONSTRAINT_NAME = 'unique_vote'
      ORDER BY ORDINAL_POSITION
    `, [dbConfig.database]);
    
    console.log('New unique_vote constraint columns:', newConstraints.map(c => c.COLUMN_NAME));
    
    console.log('\n✅ Vote constraint fix completed successfully!');
    console.log('📊 The votes table now allows multiple votes per position per voter');
    
  } catch (error) {
    console.error('\n❌ Constraint fix failed:', error.message);
    
    if (error.code === 'ER_DUP_KEYNAME') {
      console.log('\n💡 The constraint might already exist with the correct structure');
    } else if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      console.log('\n💡 The constraint might not exist, which is fine');
    }
    
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('🔌 Database connection closed');
      } catch (error) {
        console.log('Warning: Could not close database connection:', error.message);
      }
    }
  }
}

// Run the constraint fix
fixVoteConstraint(); 