import bcrypt from 'bcryptjs';
import { createConnection } from '../config/database.js';

async function testAdminLogin() {
  const db = createConnection();
  
  try {
    console.log('🔍 Testing admin login...');
    
    // Test username
    const username = 'superadmin';
    console.log(`Testing username: ${username}`);
    
    // Get admin from database
    const query = "SELECT * FROM admins WHERE username = ?";
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        db.end();
        return;
      }
      
      if (results.length === 0) {
        console.log('❌ No admin found with username:', username);
        db.end();
        return;
      }
      
      const admin = results[0];
      console.log('✅ Admin found:', {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        hasPassword: !!admin.password
      });
      
      // Test password
      const testPassword = 'superadmin123';
      console.log(`Testing password: ${testPassword}`);
      
      const isValid = await bcrypt.compare(testPassword, admin.password);
      console.log('Password valid:', isValid);
      
      if (isValid) {
        console.log('✅ Login should work!');
      } else {
        console.log('❌ Password is incorrect');
        
        // Show what the hash looks like
        console.log('Current password hash:', admin.password);
        
        // Generate new hash for comparison
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log('New hash for superadmin123:', newHash);
      }
      
      db.end();
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    db.end();
  }
}

testAdminLogin(); 