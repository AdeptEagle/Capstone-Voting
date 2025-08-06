// Test script to check current timeout issues
import axios from 'axios';

const API_BASE_URL = 'https://backend-production-219d.up.railway.app/api';

const testConfig = {
  timeout: 10000, // Use the original 10-second timeout to test
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
};

const api = axios.create(testConfig);

async function testElectionData() {
  console.log('🧪 Testing election data fetching...');
  try {
    const startTime = Date.now();
    const response = await api.get('/elections');
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Elections fetched successfully in ${duration}ms`);
    console.log(`📊 Found ${response.data.length} elections`);
    return { success: true, duration, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching elections:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ TIMEOUT ERROR detected');
    }
    return { success: false, error: error.message, code: error.code };
  }
}

async function testActiveElection() {
  console.log('🧪 Testing active election fetching...');
  try {
    const startTime = Date.now();
    const response = await api.get('/elections/active');
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Active election fetched successfully in ${duration}ms`);
    console.log(`📊 Active election:`, response.data ? response.data.title : 'None');
    return { success: true, duration, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching active election:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ TIMEOUT ERROR detected');
    }
    return { success: false, error: error.message, code: error.code };
  }
}

async function testElectionCandidates() {
  console.log('🧪 Testing election candidates endpoint...');
  try {
    // First get elections to find an active one
    const electionsResponse = await api.get('/elections');
    const elections = electionsResponse.data;
    
    if (elections.length === 0) {
      console.log('❌ No elections found');
      return { success: false, error: 'No elections found' };
    }
    
    const activeElection = elections.find(e => e.status === 'active') || elections[0];
    console.log(`Using election: ${activeElection.title} (${activeElection.status})`);
    
    const startTime = Date.now();
    const response = await api.get(`/elections/${activeElection.id}/candidate-assignments`);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Election candidates fetched successfully in ${duration}ms`);
    console.log(`📊 Found ${response.data.length} candidates`);
    
    return { success: true, duration, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching election candidates:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ TIMEOUT ERROR detected');
    }
    return { success: false, error: error.message, code: error.code };
  }
}

async function testDirectCandidates() {
  console.log('🧪 Testing direct candidates endpoint (admin only)...');
  try {
    const startTime = Date.now();
    const response = await api.get('/candidates');
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Direct candidates fetched successfully in ${duration}ms`);
    console.log(`📊 Found ${response.data.length} candidates`);
    
    return { success: true, duration, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching direct candidates:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ TIMEOUT ERROR detected');
    } else if (error.response?.status === 401) {
      console.error('🔐 AUTHENTICATION ERROR (expected for admin endpoint)');
    }
    return { success: false, error: error.message, code: error.code };
  }
}

async function testElectionPositions() {
  console.log('🧪 Testing election positions endpoint...');
  try {
    // First get elections to find an active one
    const electionsResponse = await api.get('/elections');
    const elections = electionsResponse.data;
    
    if (elections.length === 0) {
      console.log('❌ No elections found');
      return { success: false, error: 'No elections found' };
    }
    
    const activeElection = elections.find(e => e.status === 'active') || elections[0];
    
    const startTime = Date.now();
    const response = await api.get(`/elections/${activeElection.id}/positions`);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Election positions fetched successfully in ${duration}ms`);
    console.log(`📊 Found ${response.data.length} positions`);
    
    return { success: true, duration, data: response.data };
  } catch (error) {
    console.error('❌ Error fetching election positions:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ TIMEOUT ERROR detected');
    }
    return { success: false, error: error.message, code: error.code };
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting comprehensive timeout issue test...\n');
  console.log('⏱️ Using 10-second timeout to detect issues\n');
  
  const tests = [
    { name: 'Election Data', fn: testElectionData },
    { name: 'Active Election', fn: testActiveElection },
    { name: 'Election Candidates', fn: testElectionCandidates },
    { name: 'Election Positions', fn: testElectionPositions },
    { name: 'Direct Candidates (Admin)', fn: testDirectCandidates }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing: ${test.name}`);
    console.log(`${'='.repeat(50)}`);
    
    const result = await test.fn();
    results.push({ name: test.name, ...result });
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('📋 COMPREHENSIVE TEST RESULTS');
  console.log(`${'='.repeat(50)}`);
  
  let timeoutCount = 0;
  let successCount = 0;
  
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`✅ ${result.name}: PASSED (${result.duration}ms)`);
      successCount++;
    } else {
      if (result.code === 'ECONNABORTED') {
        console.log(`⏰ ${result.name}: TIMEOUT ERROR`);
        timeoutCount++;
      } else if (result.code === 401) {
        console.log(`🔐 ${result.name}: AUTH ERROR (expected)`);
      } else {
        console.log(`❌ ${result.name}: FAILED - ${result.error}`);
      }
    }
  });
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('🎯 SUMMARY');
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Successful tests: ${successCount}/${results.length}`);
  console.log(`⏰ Timeout errors: ${timeoutCount}`);
  
  if (timeoutCount > 0) {
    console.log('\n🚨 TIMEOUT ISSUES DETECTED!');
    console.log('The timeout fixes are needed.');
  } else {
    console.log('\n✅ No timeout issues detected in current version.');
  }
  
  return { results, timeoutCount, successCount };
}

// Run the comprehensive test
runComprehensiveTest().catch(console.error); 