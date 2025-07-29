import { createConnection } from "../config/database.js";

async function cleanupOldTokens() {
  const db = createConnection();
  
  try {
    console.log('🧹 Cleaning up old password reset tokens...');
    
    // Delete all existing tokens
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM password_reset_tokens', (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    console.log('✅ Cleaned up old tokens');
    console.log('✅ New tokens will use proper UTC timezone');
    console.log('✅ Password reset should now work correctly');
    
  } catch (error) {
    console.error('❌ Error cleaning up tokens:', error);
  } finally {
    db.end();
  }
}

// Run the cleanup
cleanupOldTokens(); 