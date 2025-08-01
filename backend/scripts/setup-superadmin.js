#!/usr/bin/env node

import bcrypt from "bcryptjs";
import { createConnection } from "../config/database.js";

console.log('👑 Setting up default superadmin credentials...');

async function setupSuperAdmin() {
  const db = createConnection();
  
  try {
    console.log('🔧 Configuring superadmin account...');
    
    // Hash the default password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    // Check if superadmin already exists
    const checkQuery = "SELECT id FROM admins WHERE id = 'superadmin-001'";
    
    db.query(checkQuery, (checkErr, checkResult) => {
      if (checkErr) {
        console.error('❌ Error checking superadmin:', checkErr);
        db.end();
        return;
      }
      
      if (checkResult.length > 0) {
        // Update existing superadmin
        console.log('📝 Updating existing superadmin account...');
        const updateQuery = `
          UPDATE admins 
          SET username = 'superadmin', 
              email = 'superadmin@votingsystem.com', 
              password = ?, 
              role = 'superadmin' 
          WHERE id = 'superadmin-001'
        `;
        
        db.query(updateQuery, [hashedPassword], (updateErr) => {
          if (updateErr) {
            console.error('❌ Error updating superadmin:', updateErr);
          } else {
            console.log('✅ Superadmin account updated successfully!');
            console.log('🔑 Default credentials: superadmin / superadmin123');
          }
          db.end();
        });
      } else {
        // Create new superadmin account
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
            console.log('🔑 Default credentials: superadmin / superadmin123');
          }
          db.end();
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error in setupSuperAdmin:', error);
    db.end();
  }
}

// Run the setup
setupSuperAdmin(); 