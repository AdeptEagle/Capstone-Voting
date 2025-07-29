#!/usr/bin/env node

// Server with database connection test for Railway
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server with database test...');
console.log('📋 Environment check:');
console.log('  PORT:', process.env.PORT || 'not set');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  DB_HOST:', process.env.DB_HOST || 'not set');
console.log('  DB_USER:', process.env.DB_USER || 'not set');
console.log('  DB_NAME:', process.env.DB_NAME || 'not set');

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

// Test database connection
async function testDatabaseConnection() {
  try {
    console.log('\n🚀 Testing database connection...');
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    console.log('✅ Database test completed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    database: dbConfig.host
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint requested');
  res.json({
    message: 'Server with database test is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    database: dbConfig.host
  });
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
  console.log('🔍 Database test endpoint requested');
  const success = await testDatabaseConnection();
  
  if (success) {
    res.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Start server and test database
async function startServer() {
  try {
    // Test database first
    const dbSuccess = await testDatabaseConnection();
    
    if (!dbSuccess) {
      console.log('⚠️ Database connection failed, but starting server anyway for health checks');
    }
    
    // Start server regardless of database status
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server started successfully on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
      console.log(`🔍 Database test: http://localhost:${PORT}/test-db`);
    });

    // Handle errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error.message);
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully');
      server.close(() => {
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 Received SIGINT, shutting down gracefully');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 