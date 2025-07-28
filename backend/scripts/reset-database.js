#!/usr/bin/env node

import { createConnection, runQuery } from '../config/database.js';

console.log('🔄 Database Reset Script');
console.log('========================\n');

async function resetDatabase() {
  const db = createConnection();
  
  try {
    console.log('🗑️ Dropping all tables...');
    
    // Drop tables in reverse dependency order
    const tablesToDrop = [
      'password_reset_tokens',
      'votes',
      'election_candidates',
      'election_positions',
      'candidates',
      'voters',
      'elections',
      'positions',
      'courses',
      'departments',
      'admins'
    ];
    
    for (const table of tablesToDrop) {
      try {
        await runQuery(db, `DROP TABLE IF EXISTS ${table}`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️ Could not drop ${table}: ${error.message}`);
      }
    }
    
    console.log('\n🏗️ Recreating database structure...');
    
    // Recreate tables by calling the database initialization
    const { ensureDatabaseAndTables } = await import('../config/database.js');
    await ensureDatabaseAndTables();
    
    console.log('\n✅ Database reset completed successfully!');
    console.log('📊 All tables have been recreated with proper structure');
    console.log('🌱 You can now run: npm run seed');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    db.end();
  }
}

// Run the reset
resetDatabase().catch(console.error); 