#!/usr/bin/env node

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

console.log('👑 Seeding Permanent SuperAdmin Account');
console.log('========================================\n');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'voting_system',
  charset: 'utf8mb4',
  timezone: '+00:00',
  multipleStatements: true
};

async function seedSuperAdmin() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    // Create superadmin account
    console.log('👑 Creating permanent superadmin account...');
    const superadminPassword = await bcrypt.hash('superadmin123', 10);
    
    await connection.execute(
      `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?, password = ?`,
      [
        'superadmin-001', 
        'Super admin -DevKerbs', 
        'superadmin@votingsystem.com', 
        superadminPassword, 
        'superadmin', 
        'superadmin', 
        superadminPassword
      ]
    );
    
    console.log('✅ SuperAdmin account created/updated successfully!');
    console.log('\n📊 SuperAdmin Details:');
    console.log('   - Username: Super admin -DevKerbs');
    console.log('   - Email: superadmin@votingsystem.com');
    console.log('   - Password: superadmin123');
    console.log('   - Role: superadmin');
    console.log('   - ID: superadmin-001');
    
    console.log('\n🎯 Account will persist across:');
    console.log('   - Database cloning');
    console.log('   - Cloud deployments');
    console.log('   - System migrations');
    console.log('   - Fresh installations');
    console.log('   - Environment changes');
    
    console.log('\n💡 To run this script again:');
    console.log('   node backend/scripts/seed-superadmin.js');
    
  } catch (error) {
    console.error('\n❌ SuperAdmin seeding failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check database connection settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check database credentials');
      console.log('   - Verify database exists');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Run database creation first: npm run create-db');
      console.log('   - Or run complete setup: npm run setup-db');
    }
    
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.log('Warning: Could not close database connection:', error.message);
      }
    }
  }
}

// Run the superadmin seeding
seedSuperAdmin(); 