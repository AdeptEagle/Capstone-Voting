import { createConnection } from "../config/database.js";

async function fixPasswordResetTable() {
  const db = createConnection();
  
  try {
    console.log('🔧 Fixing password_reset_tokens table...');
    
    // Drop the existing table
    await new Promise((resolve, reject) => {
      db.query('DROP TABLE IF EXISTS password_reset_tokens', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Dropped existing password_reset_tokens table');
    
    // Create the table with the correct schema
    const createTableQuery = `
      CREATE TABLE password_reset_tokens (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        user_type ENUM('voter', 'admin') NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await new Promise((resolve, reject) => {
      db.query(createTableQuery, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Created password_reset_tokens table with user_type column');
    console.log('✅ Password reset functionality should now work correctly');
    
  } catch (error) {
    console.error('❌ Error fixing password_reset_tokens table:', error);
  } finally {
    db.end();
  }
}

// Run the fix
fixPasswordResetTable(); 