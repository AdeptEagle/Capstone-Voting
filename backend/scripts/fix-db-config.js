#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from "mysql2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Database Configuration Fixer');
console.log('===============================\n');

// Common database configurations to try
const configs = [
  {
    name: 'XAMPP Default',
    config: {
      host: "localhost",
      user: "root",
      password: "",
      port: 3306
    }
  },
  {
    name: 'WAMP Default',
    config: {
      host: "localhost",
      user: "root",
      password: "",
      port: 3306
    }
  },
  {
    name: 'MySQL Default',
    config: {
      host: "localhost",
      user: "root",
      password: "root",
      port: 3306
    }
  },
  {
    name: 'Docker MySQL',
    config: {
      host: "localhost",
      user: "root",
      password: "root",
      port: 3306
    }
  }
];

async function testConnection(config) {
  return new Promise((resolve) => {
    const connection = mysql.createConnection({
      ...config,
      charset: 'utf8mb4',
      timezone: '+00:00',
      connectTimeout: 5000
    });
    
    connection.connect((err) => {
      if (err) {
        console.log(`❌ ${config.name}: ${err.message}`);
        connection.end();
        resolve(false);
      } else {
        console.log(`✅ ${config.name}: Connected successfully`);
        connection.end();
        resolve(true);
      }
    });
  });
}

function updateDatabaseConfig(workingConfig) {
  const dbConfigPath = join(__dirname, '..', 'config', 'database.js');
  
  try {
    let content = readFileSync(dbConfigPath, 'utf8');
    
    // Update the database configuration
    const newConfig = `const dbConfig = {
  host: "${workingConfig.host}",
  user: "${workingConfig.user}",
  password: "${workingConfig.password}",
  port: ${workingConfig.port},
  charset: 'utf8mb4',
  timezone: '+00:00'
};`;
    
    // Replace the existing dbConfig
    content = content.replace(
      /const dbConfig = \{[\s\S]*?\};/,
      newConfig
    );
    
    writeFileSync(dbConfigPath, content, 'utf8');
    console.log('✅ Database configuration updated successfully!');
    
  } catch (error) {
    console.error('❌ Failed to update database configuration:', error.message);
  }
}

async function main() {
  console.log('Testing database connections...\n');
  
  let workingConfig = null;
  
  for (const config of configs) {
    const success = await testConnection(config.config);
    if (success) {
      workingConfig = config.config;
      break;
    }
  }
  
  if (workingConfig) {
    console.log(`\n✅ Found working configuration: ${workingConfig.name || 'Custom'}`);
    console.log('Updating database configuration...');
    updateDatabaseConfig(workingConfig);
    
    console.log('\n🎉 Database configuration fixed!');
    console.log('You can now run: npm run dev');
  } else {
    console.log('\n❌ No working database configuration found');
    console.log('\n🔧 Manual Solutions:');
    console.log('1. Install XAMPP: https://www.apachefriends.org/');
    console.log('2. Install WAMP: https://www.wampserver.com/');
    console.log('3. Install MySQL: https://dev.mysql.com/downloads/');
    console.log('4. Use Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0');
    console.log('\nAfter installing, run: npm run troubleshoot');
  }
}

main().catch(console.error); 