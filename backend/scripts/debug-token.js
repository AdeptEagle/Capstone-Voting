import { createConnection } from "../config/database.js";

async function debugToken() {
  const db = createConnection();
  
  try {
    console.log('🔍 Debugging password reset tokens...');
    
    // Check all tokens in the database
    const allTokens = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM password_reset_tokens ORDER BY created_at DESC', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('📊 All tokens in database:');
    console.log('=====================================');
    allTokens.forEach((token, index) => {
      console.log(`Token ${index + 1}:`);
      console.log(`  ID: ${token.id}`);
      console.log(`  Email: ${token.email}`);
      console.log(`  Token: ${token.token}`);
      console.log(`  User Type: ${token.user_type}`);
      console.log(`  Expires: ${token.expires_at}`);
      console.log(`  Created: ${token.created_at}`);
      console.log('  ---');
    });
    
    if (allTokens.length === 0) {
      console.log('❌ No tokens found in database');
    } else {
      // Test the latest token
      const latestToken = allTokens[0];
      console.log('🧪 Testing latest token verification...');
      
      const testResult = await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
          [latestToken.token],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });
      
      console.log(`✅ Token verification result: ${testResult.length} matches found`);
      
      if (testResult.length === 0) {
        console.log('❌ Token verification failed - checking why...');
        
        // Check if token exists at all
        const tokenExists = await new Promise((resolve, reject) => {
          db.query(
            'SELECT * FROM password_reset_tokens WHERE token = ?',
            [latestToken.token],
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        });
        
        console.log(`Token exists: ${tokenExists.length > 0}`);
        
        if (tokenExists.length > 0) {
          const token = tokenExists[0];
          const now = new Date();
          const expiresAt = new Date(token.expires_at);
          
          console.log(`Current time: ${now}`);
          console.log(`Token expires: ${expiresAt}`);
          console.log(`Token expired: ${now > expiresAt}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging tokens:', error);
  } finally {
    db.end();
  }
}

// Run the debug
debugToken(); 