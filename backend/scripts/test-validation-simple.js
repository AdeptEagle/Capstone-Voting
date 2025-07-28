// Simple validation test that doesn't require server
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

// The same regex pattern used in the backend
const idPattern = /^\d{4}-\d{5}$/;

function validateStudentId(studentId) {
  return idPattern.test(studentId);
}

function runValidationTests() {
  console.log('🧪 Testing Student ID Validation (Regex Pattern)...\n');
  
  let passed = 0;
  let total = 0;
  
  for (const testCase of testCases) {
    const isValid = validateStudentId(testCase.studentId);
    const expected = testCase.expected === 'PASS';
    
    if (isValid === expected) {
      console.log(`✅ PASS: ${testCase.description}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${testCase.description}`);
      console.log(`   Input: "${testCase.studentId}"`);
      console.log(`   Expected: ${testCase.expected}, Got: ${isValid ? 'PASS' : 'FAIL'}`);
    }
    total++;
  }
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All validation tests passed! The regex pattern is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the regex pattern.');
  }
}

// Run the tests
runValidationTests(); 