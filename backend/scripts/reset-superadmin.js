import bcrypt from "bcryptjs";
import { createConnection } from "../config/database.js";

async function resetSuperAdmin() {
  const db = createConnection();
  
  try {
    console.log('🔧 Resetting superadmin account...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    // Update the superadmin account
    const updateQuery = `
      UPDATE admins 
      SET username = 'superadmin', 
          email = 'superadmin@votingsystem.com', 
          password = ?, 
          role = 'superadmin' 
      WHERE id = 'superadmin-001'
    `;
    
    db.query(updateQuery, [hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Error updating superadmin:', err);
        db.end();
        return;
      }
      
      if (result.affectedRows === 0) {
        // If no rows were affected, create the superadmin account
        console.log('📝 Creating new superadmin account...');
        const insertQuery = `
          INSERT INTO admins (id, username, email, password, role) 
          VALUES ('superadmin-001', 'superadmin', 'superadmin@votingsystem.com', ?, 'superadmin')
        `;
        
        db.query(insertQuery, [hashedPassword], (insertErr) => {
          if (insertErr) {
            console.error('❌ Error creating superadmin:', insertErr);
          } else {
            console.log('✅ Superadmin account created successfully!');
          }
          db.end();
        });
      } else {
        console.log('✅ Superadmin account updated successfully!');
        db.end();
      }
    });
    
  } catch (error) {
    console.error('❌ Error in resetSuperAdmin:', error);
    db.end();
  }
}

// Run the reset
resetSuperAdmin(); 