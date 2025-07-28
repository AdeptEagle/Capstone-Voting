#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Quick Setup for Voting System Backend');

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkPrerequisites() {
  console.log('Checking prerequisites...');
  
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js version 18+ required. Current version: ${nodeVersion}`);
    }
    
    await runCommand('npm', ['--version']);
    
    try {
      await runCommand('mysql', ['--version']);
    } catch (error) {
      console.log('MySQL not found in PATH. Please ensure MySQL is installed and running.');
    }
    
  } catch (error) {
    console.error(`Prerequisites check failed: ${error.message}`);
    throw error;
  }
}

async function installDependencies() {
  console.log('Installing dependencies...');
  
  try {
    await runCommand('npm', ['install']);
  } catch (error) {
    console.error(`Failed to install dependencies: ${error.message}`);
    throw error;
  }
}

async function setupEnvironment() {
  console.log('Setting up environment...');
  
  try {
    const envExamplePath = join(__dirname, '..', 'env.example');
    const envPath = join(__dirname, '..', '.env');
    
    if (!existsSync(envPath)) {
      if (existsSync(envExamplePath)) {
        copyFileSync(envExamplePath, envPath);
      } else {
        const basicEnv = `# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306

# Test Configuration
IS_TEST=false

# Frontend URL (for CORS in production)
FRONTEND_URL=http://localhost:5173
`;
        
        const fs = await import('fs');
        fs.writeFileSync(envPath, basicEnv);
      }
    }
    
  } catch (error) {
    console.error(`Failed to setup environment: ${error.message}`);
    throw error;
  }
}

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const testProcess = spawn('node', ['server.js'], {
      cwd: join(__dirname, '..'),
      env: {
        ...process.env,
        IS_TEST: 'true',
        NODE_ENV: 'test'
      },
      stdio: 'pipe'
    });
    
    let output = '';
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    testProcess.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        testProcess.kill();
        reject(new Error('Database test timeout'));
      }, 30000);
      
      testProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0 || output.includes('Database initialization completed')) {
          resolve();
        } else {
          reject(new Error(`Database test failed with code ${code}`));
        }
      });
    });
    
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.log('Please check your MySQL configuration and ensure the server is running.');
    throw error;
  }
}

async function runTests() {
  console.log('Running API tests...');
  
  try {
    await runCommand('node', ['scripts/test-api.js'], {
      cwd: join(__dirname, '..')
    });
  } catch (error) {
    console.log('API tests failed. You can run tests later with: npm test');
  }
}

async function showNextSteps() {
  console.log('\nSetup completed successfully!');
  console.log('\nNext Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Test the API: npm test');
  console.log('3. Check health status: npm run health');
  console.log('4. Access the API at: http://localhost:3000');
  
  console.log('\nUseful Commands:');
  console.log('• npm run dev          - Start development server');
  console.log('• npm start            - Start production server');
  console.log('• npm test             - Run API tests');
  console.log('• npm run test:db      - Start test database');
  console.log('• npm run health       - Check server health');
  
  console.log('\nConfiguration:');
  console.log('• Edit .env file to change database settings');
  console.log('• Check README.md for detailed documentation');
}

async function main() {
  try {
    await checkPrerequisites();
    await installDependencies();
    await setupEnvironment();
    await testDatabaseConnection();
    await runTests();
    await showNextSteps();
  } catch (error) {
    console.error(`\nSetup failed: ${error.message}`);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure MySQL is running and accessible');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Verify Node.js version 18+ is installed');
    console.log('4. Check the README.md for detailed setup instructions');
    process.exit(1);
  }
}

// Run the setup
main(); 