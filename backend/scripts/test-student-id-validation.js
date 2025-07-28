import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testCases = [
  { studentId: '123123123123ac', expected: 'FAIL', description: 'Invalid format - letters and numbers mixed' },
  { studentId: '2024-12345', expected: 'PASS', description: 'Valid format - YYYY-NNNNN' },
  { studentId: '2024-00001', expected: 'PASS', description: 'Valid format - YYYY-NNNNN with zeros' },
  { studentId: '2024-99999', expected: 'PASS', description: 'Valid format - YYYY-NNNNN with nines' },
  { studentId: '2024-1234', expected: 'FAIL', description: 'Invalid format - missing digit' },
  { studentId: '2024-123456', expected: 'FAIL', description: 'Invalid format - extra digit' },
  { studentId: '2024-1234a', expected: 'FAIL', description: 'Invalid format - contains letter' },
  { studentId: '2023-00001', expected: 'PASS', description: 'Valid format - different year' },
  { studentId: '2024-00000', expected: 'PASS', description: 'Valid format - all zeros' },
  { studentId: '2024-', expected: 'FAIL', description: 'Invalid format - incomplete' },
  { studentId: '-00001', expected: 'FAIL', description: 'Invalid format - missing year' },
  { studentId: '2024/00001', expected: 'FAIL', description: 'Invalid format - wrong separator' },
  { studentId: '2024_00001', expected: 'FAIL', description: 'Invalid format - underscore separator' },
];

async function testVoterCreation(studentId, expected, description) {
  try {
    const response = await axios.post(`${BASE_URL}/voters`, {
      name: 'Test Voter',
      email: `test-${Date.now()}@example.com`,
      studentId: studentId,
      departmentId: 'dept-001',
      courseId: 'course-001'
    });
    
    if (expected === 'PASS') {
      console.log(`✅ PASS: ${description}`);
      return true;
    } else {
      console.log(`❌ FAIL: ${description} - Should have failed but succeeded`);
      return false;
    }
  } catch (error) {
    if (expected === 'FAIL') {
      console.log(`✅ PASS: ${description} - Correctly rejected: ${error.response?.data?.error || error.message}`);
      return true;
    } else {
      console.log(`❌ FAIL: ${description} - Should have passed but failed: ${error.response?.data?.error || error.message}`);
      return false;
    }
  }
}

async function testUserRegistration(studentId, expected, description) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/user/register`, {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      studentId: studentId,
      password: 'testpass123',
      departmentId: 'dept-001',
      courseId: 'course-001'
    });
    
    if (expected === 'PASS') {
      console.log(`✅ PASS: ${description}`);
      return true;
    } else {
      console.log(`❌ FAIL: ${description} - Should have failed but succeeded`);
      return false;
    }
  } catch (error) {
    if (expected === 'FAIL') {
      console.log(`✅ PASS: ${description} - Correctly rejected: ${error.response?.data?.error || error.message}`);
      return true;
    } else {
      console.log(`❌ FAIL: ${description} - Should have passed but failed: ${error.response?.data?.error || error.message}`);
      return false;
    }
  }
}

async function runTests() {
  console.log('🧪 Testing Student ID Validation...\n');
  
  console.log('📋 Testing Admin Voter Creation:');
  let adminPassed = 0;
  let adminTotal = 0;
  
  for (const testCase of testCases) {
    const result = await testVoterCreation(testCase.studentId, testCase.expected, testCase.description);
    if (result) adminPassed++;
    adminTotal++;
  }
  
  console.log(`\n📊 Admin Voter Creation Results: ${adminPassed}/${adminTotal} tests passed\n`);
  
  console.log('📋 Testing User Registration:');
  let userPassed = 0;
  let userTotal = 0;
  
  for (const testCase of testCases) {
    const result = await testUserRegistration(testCase.studentId, testCase.expected, testCase.description);
    if (result) userPassed++;
    userTotal++;
  }
  
  console.log(`\n📊 User Registration Results: ${userPassed}/${userTotal} tests passed\n`);
  
  console.log('🎉 Validation Test Complete!');
  console.log(`✅ Admin Voter Creation: ${adminPassed}/${adminTotal} passed`);
  console.log(`✅ User Registration: ${userPassed}/${userTotal} passed`);
}

// Run the tests
runTests().catch(console.error); 