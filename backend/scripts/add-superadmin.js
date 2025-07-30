#!/usr/bin/env node
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

console.log('🚀 Adding Superadmin Account to Existing Database');
console.log('================================================\n');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

const DB_NAME = 'voting_system';

async function addSuperadmin() {
  let connection;
  
  try {
    console.log('🔍 Testing MySQL connection...');
    connection = await mysql.createConnection({
      ...dbConfig,
      database: DB_NAME
    });
    console.log('✅ MySQL connection successful\n');
    
    console.log('👑 Adding superadmin account...');
    
    // Hash the password
    const superadminPassword = await bcrypt.hash('devEagle123', 10);
    
    // Check if superadmin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admins WHERE username = ?',
      ['DevEagle']
    );
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Superadmin account already exists!');
      console.log('\n🔑 Existing Credentials:');
      console.log('   Username: DevEagle');
      console.log('   Password: devEagle123');
      console.log('   Email: devEagle@votingsystem.com');
      console.log('   Role: superadmin');
      return;
    }
    
    // Insert the superadmin
    await connection.execute(
      `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      ['superadmin-001', 'DevEagle', 'devEagle@votingsystem.com', superadminPassword, 'superadmin']
    );
    
    console.log('✅ Superadmin account created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Username: DevEagle');
    console.log('   Password: devEagle123');
    console.log('   Email: devEagle@votingsystem.com');
    console.log('   Role: superadmin');
    
    console.log('\n🌐 You can now login to the voting system with these credentials.');
    
  } catch (error) {
    console.error('\n❌ Failed to add superadmin:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check if MySQL is installed and started');
      console.log('   - Verify the database credentials');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check MySQL username and password');
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
      } catch (error) {
        console.log('Warning: Could not close database connection:', error.message);
      }
    }
  }
}

addSuperadmin(); 