#!/usr/bin/env node

// Super simple test server for Railway debugging
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting simple test server...');
console.log('📋 Environment check:');
console.log('  PORT:', process.env.PORT || 'not set');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  DB_HOST:', process.env.DB_HOST || 'not set');

// Simple health check
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint requested');
  res.json({
    message: 'Simple test server is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server started successfully on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
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

console.log('✅ Simple test server setup complete'); 