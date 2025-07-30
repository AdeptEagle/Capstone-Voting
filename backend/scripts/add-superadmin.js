#!/usr/bin/env node

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

console.log('👑 Adding Superadmin Account to Database');
console.log('=========================================\n');

// Database configuration - update these values for your Railway database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'voting_system',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function addSuperadmin() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    console.log('👑 Creating superadmin account...');
    const superadminPassword = await bcrypt.hash('superadmin123', 10);
    
    // Check if superadmin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admins WHERE username = ?',
      ['Super admin -DevKerbs']
    );
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Superadmin account already exists!');
      console.log('   Username: Super admin -DevKerbs');
      console.log('   Password: superadmin123');
      return;
    }
    
    // Insert superadmin
    await connection.execute(
      `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      ['superadmin-001', 'Super admin -DevKerbs', 'superadmin@votingsystem.com', superadminPassword, 'superadmin']
    );
    
    console.log('✅ Superadmin account created successfully!');
    console.log('\n🔑 Superadmin Login Credentials:');
    console.log('   Username: Super admin -DevKerbs');
    console.log('   Password: superadmin123');
    console.log('   Email: superadmin@votingsystem.com');
    console.log('   Role: superadmin');
    
  } catch (error) {
    console.error('\n❌ Failed to add superadmin:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check database connection settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check database credentials');
      console.log('   - Update the dbConfig in this script');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Database does not exist');
      console.log('   - Run the create-database.js script first');
    }
    
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('\n✅ Database connection closed');
      } catch (error) {
        console.log('Warning: Could not close database connection:', error.message);
      }
    }
  }
}

// Run the superadmin creation
addSuperadmin(); 