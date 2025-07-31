#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'https://backend-production-219d.up.railway.app/api';

// Test multiple delete endpoints
async function testMultipleDelete() {
  console.log('🧪 Testing Multiple Delete Endpoints');
  console.log('===================================\n');

  try {
    // Test multiple positions delete
    console.log('📋 Testing multiple positions delete...');
    const positionsResponse = await axios.delete(`${API_BASE}/positions`, {
      data: { ids: ['test-pos-1', 'test-pos-2'] }
    });
    console.log('✅ Positions multiple delete endpoint working');
    console.log('   Response:', positionsResponse.data);

    // Test multiple candidates delete
    console.log('\n👥 Testing multiple candidates delete...');
    const candidatesResponse = await axios.delete(`${API_BASE}/candidates`, {
      data: { ids: ['test-candidate-1', 'test-candidate-2'] }
    });
    console.log('✅ Candidates multiple delete endpoint working');
    console.log('   Response:', candidatesResponse.data);

    // Test multiple voters delete
    console.log('\n🗳️ Testing multiple voters delete...');
    const votersResponse = await axios.delete(`${API_BASE}/voters`, {
      data: { ids: [1, 2] }
    });
    console.log('✅ Voters multiple delete endpoint working');
    console.log('   Response:', votersResponse.data);

    console.log('\n🎉 All multiple delete endpoints are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testMultipleDelete(); 