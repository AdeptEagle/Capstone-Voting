#!/usr/bin/env node

import mysql from "mysql2";

console.log('🔍 Database Connection Troubleshooter');
console.log('=====================================\n');

// Test different database configurations
const configs = [
  {
    name: 'Default (root/root)',
    config: {
      host: "localhost",
      user: "root",
      password: "root",
      port: 3306,
      charset: 'utf8mb4',
      timezone: '+00:00'
    }
  },
  {
    name: 'Default (root/no password)',
    config: {
      host: "localhost",
      user: "root",
      password: "",
      port: 3306,
      charset: 'utf8mb4',
      timezone: '+00:00'
    }
  },
  {
    name: 'Default (root/root) - Port 3307',
    config: {
      host: "localhost",
      user: "root",
      password: "root",
      port: 3307,
      charset: 'utf8mb4',
      timezone: '+00:00'
    }
  }
];

async function testConnection(config, name) {
  return new Promise((resolve) => {
    console.log(`Testing: ${name}`);
    
    const connection = mysql.createConnection(config);
    
    connection.connect((err) => {
      if (err) {
        console.log(`❌ Failed: ${err.message}`);
        console.log(`   Error Code: ${err.code}`);
        console.log(`   SQL State: ${err.sqlState}`);
        console.log('');
        connection.end();
        resolve({ success: false, error: err });
      } else {
        console.log(`✅ Success: Connected to MySQL`);
        
        // Test creating database
        connection.query('CREATE DATABASE IF NOT EXISTS `voting_system`', (err) => {
          if (err) {
            console.log(`❌ Failed to create database: ${err.message}`);
          } else {
            console.log(`✅ Success: Database 'voting_system' created/verified`);
          }
          
          connection.end();
          resolve({ success: true });
        });
      }
    });
  });
}

async function checkMySQLService() {
  console.log('🔧 Checking MySQL Service Status...\n');
  
  // Test if MySQL is running on common ports
  const ports = [3306, 3307];
  
  for (const port of ports) {
    try {
      const connection = mysql.createConnection({
        host: "localhost",
        port: port,
        user: "root",
        password: "root",
        connectTimeout: 5000
      });
      
      await new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            console.log(`❌ Port ${port}: MySQL not accessible`);
            reject(err);
          } else {
            console.log(`✅ Port ${port}: MySQL is running`);
            connection.end();
            resolve();
          }
        });
      });
    } catch (error) {
      // Continue to next port
    }
  }
}

async function main() {
  console.log('Step 1: Checking MySQL Service...\n');
  await checkMySQLService();
  
  console.log('\nStep 2: Testing Database Connections...\n');
  
  let workingConfig = null;
  
  for (const config of configs) {
    const result = await testConnection(config.config, config.name);
    if (result.success) {
      workingConfig = config;
      break;
    }
  }
  
  console.log('\n📋 Troubleshooting Summary:');
  console.log('============================');
  
  if (workingConfig) {
    console.log(`✅ Working configuration found: ${workingConfig.name}`);
    console.log('\nTo fix your database connection:');
    console.log('1. Update backend/config/database.js with the working configuration');
    console.log('2. Or set environment variables:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=root (or empty)');
    console.log('   DB_PORT=3306 (or 3307)');
  } else {
    console.log('❌ No working configuration found');
    console.log('\nPossible solutions:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check if MySQL service is started');
    console.log('3. Verify MySQL credentials');
    console.log('4. Check if MySQL is running on a different port');
    console.log('5. Try installing XAMPP, WAMP, or similar if MySQL is not installed');
  }
  
  console.log('\n🔧 Common Solutions:');
  console.log('====================');
  console.log('1. Install XAMPP (includes MySQL): https://www.apachefriends.org/');
  console.log('2. Install WAMP (Windows): https://www.wampserver.com/');
  console.log('3. Install MySQL directly: https://dev.mysql.com/downloads/');
  console.log('4. Use Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0');
}

main().catch(console.error); 