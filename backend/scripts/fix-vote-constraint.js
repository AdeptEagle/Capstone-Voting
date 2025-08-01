#!/usr/bin/env node

import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'root',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'voting_system',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function fixVoteConstraint() {
  let connection;
  try {
    console.log('🔧 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Drop the old unique constraint
    console.log('🔄 Dropping old unique constraint...');
    try {
      await connection.execute('ALTER TABLE votes DROP INDEX unique_vote');
      console.log('✅ Old constraint dropped');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️ Old constraint not found, proceeding...');
      } else {
        throw error;
      }
    }

    // Add the new unique constraint that only prevents duplicate votes for the same candidate
    console.log('🔄 Adding new unique constraint...');
    await connection.execute(`
      ALTER TABLE votes
      ADD UNIQUE KEY unique_vote (voterId, electionId, candidateId)
    `);
    console.log('✅ New constraint added');

    // Verify the change
    console.log('🔍 Verifying constraint...');
    const [constraints] = await connection.execute(`
      SELECT CONSTRAINT_NAME, COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'votes' AND CONSTRAINT_NAME = 'unique_vote'
      ORDER BY ORDINAL_POSITION
    `, [dbConfig.database]);

    console.log('\n📊 Current unique constraint columns:');
    for (const constraint of constraints) {
      console.log(`   - ${constraint.COLUMN_NAME}`);
    }

    console.log('\n✅ Vote constraint update completed successfully!');

  } catch (error) {
    console.error('\n❌ Error updating vote constraint:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\n💡 Note: There are existing duplicate votes that conflict with the new constraint.');
      console.log('   You may need to clean up duplicate votes before applying the constraint.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the fix
fixVoteConstraint();