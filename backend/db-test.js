#!/usr/bin/env node

// Database connection test for Railway
import mysql from 'mysql2/promise';

console.log('🔍 Testing Database Connection...');
console.log('===============================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST || 'not set');
console.log('DB_USER:', process.env.DB_USER || 'not set');
console.log('DB_NAME:', process.env.DB_NAME || 'not set');
console.log('DB_PORT:', process.env.DB_PORT || 'not set');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'voting_system',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

console.log('\n🔧 Database Config:');
console.log('Host:', dbConfig.host);
console.log('User:', dbConfig.user);
console.log('Port:', dbConfig.port);
console.log('Database:', dbConfig.database);

// Test connection
async function testConnection() {
  try {
    console.log('\n🚀 Attempting database connection...');
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Database test completed successfully!');
    process.exit(0);
  } else {
    console.log('\n💥 Database test failed!');
    process.exit(1);
  }
}); 