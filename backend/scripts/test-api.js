#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 10000; // 10 seconds

// Test data
const testData = {
  admin: {
    username: 'superadmin',
    password: 'superadmin123'
  },
  voter: {
    email: 'voter1@test.com',
    password: 'password123'
  }
};

// Test results
let passed = 0;
let failed = 0;
let total = 0;

function logTest(name, success, details = '') {
  total++;
  if (success) {
    passed++;
    console.log(`✅ ${name}`);
  } else {
    failed++;
    console.log(`❌ ${name}`);
    if (details) {
      console.log(`   Details: ${details}`);
    }
  }
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: TEST_TIMEOUT,
      ...options
    });
    
    const data = await response.json().catch(() => ({}));
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

async function testHealthCheck() {
  const result = await makeRequest(`${BASE_URL}/health`);
  logTest('Health Check', result.ok && result.status === 200);
}

async function testRootEndpoint() {
  const result = await makeRequest(`${BASE_URL}/`);
  logTest('Root Endpoint', result.ok && result.status === 200);
}

async function testAuthEndpoints() {
  // Test admin login
  const adminLoginResult = await makeRequest(`${BASE_URL}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData.admin)
  });
  
  logTest('Admin Login', adminLoginResult.ok && adminLoginResult.status === 200);
  
  let adminToken = '';
  if (adminLoginResult.ok) {
    adminToken = adminLoginResult.data.token;
  }
  
  // Test voter login
  const voterLoginResult = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData.voter)
  });
  
  logTest('Voter Login', voterLoginResult.ok && voterLoginResult.status === 200);
  
  let voterToken = '';
  if (voterLoginResult.ok) {
    voterToken = voterLoginResult.data.token;
  }
  
  return { adminToken, voterToken };
}

async function testProtectedEndpoints(tokens) {
  const { adminToken, voterToken } = tokens;
  
  if (adminToken) {
    const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };
    
    const positionsResult = await makeRequest(`${BASE_URL}/api/positions`, {
      headers: adminHeaders
    });
    logTest('Get Positions (Admin)', positionsResult.ok);
    
    const candidatesResult = await makeRequest(`${BASE_URL}/api/candidates`, {
      headers: adminHeaders
    });
    logTest('Get Candidates (Admin)', candidatesResult.ok);
    
    const votersResult = await makeRequest(`${BASE_URL}/api/voters`, {
      headers: adminHeaders
    });
    logTest('Get Voters (Admin)', votersResult.ok);
    
    const electionsResult = await makeRequest(`${BASE_URL}/api/elections`, {
      headers: adminHeaders
    });
    logTest('Get Elections (Admin)', electionsResult.ok);
  }
  
  if (voterToken) {
    const voterHeaders = { 'Authorization': `Bearer ${voterToken}` };
    
    const profileResult = await makeRequest(`${BASE_URL}/api/auth/profile`, {
      headers: voterHeaders
    });
    logTest('Get Voter Profile', profileResult.ok);
  }
}

async function testPasswordReset() {
  const testEmail = 'test@example.com';
  
  const forgotResult = await makeRequest(`${BASE_URL}/api/password-reset/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, userType: 'voter' })
  });
  
  logTest('Forgot Password Request', forgotResult.ok);
  
  const testResult = await makeRequest(`${BASE_URL}/api/password-reset/test`);
  logTest('Password Reset Test Endpoint', testResult.ok);
}

async function testFileUpload() {
  const uploadsResult = await makeRequest(`${BASE_URL}/uploads`);
  logTest('Uploads Directory Access', uploadsResult.status === 200 || uploadsResult.status === 404);
}

async function runAllTests() {
  console.log('Running API Tests...\n');
  
  try {
    await testHealthCheck();
    await testRootEndpoint();
    
    const tokens = await testAuthEndpoints();
    await testProtectedEndpoints(tokens);
    await testPasswordReset();
    await testFileUpload();
    
  } catch (error) {
    console.error(`Test execution failed: ${error.message}`);
  }
  
  // Print summary
  console.log(`\nTest Summary: ${passed} passed, ${failed} failed, ${total} total`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests
runAllTests(); 