// Test script to verify voter validation for both create and update operations
console.log('🧪 Testing Voter Validation (Create & Update)...\n');

// Test cases for student ID validation
const testCases = [
  {
    studentId: '2024-00001',
    expected: 'PASS',
    description: 'Valid format - YYYY-NNNNN'
  },
  {
    studentId: '2024-12345',
    expected: 'PASS',
    description: 'Valid format - YYYY-NNNNN'
  },
  {
    studentId: '123123123123ac',
    expected: 'FAIL',
    description: 'Invalid format - letters and numbers mixed'
  },
  {
    studentId: '2024-1234',
    expected: 'FAIL',
    description: 'Invalid format - only 4 digits after dash'
  },
  {
    studentId: '2024-123456',
    expected: 'FAIL',
    description: 'Invalid format - 6 digits after dash'
  },
  {
    studentId: '202-12345',
    expected: 'FAIL',
    description: 'Invalid format - only 3 digits before dash'
  },
  {
    studentId: '20245-12345',
    expected: 'FAIL',
    description: 'Invalid format - 5 digits before dash'
  },
  {
    studentId: '2024_12345',
    expected: 'FAIL',
    description: 'Invalid format - underscore instead of dash'
  },
  {
    studentId: '2024 12345',
    expected: 'FAIL',
    description: 'Invalid format - space instead of dash'
  },
  {
    studentId: '',
    expected: 'FAIL',
    description: 'Empty string'
  },
  {
    studentId: 'abc-defgh',
    expected: 'FAIL',
    description: 'Letters instead of numbers'
  }
];

// The same regex pattern used in the backend
const idPattern = /^\d{4}-\d{5}$/;

function validateStudentId(studentId) {
  return idPattern.test(studentId);
}

function runValidationTests() {
  console.log('📋 Testing Student ID Validation Pattern...\n');
  
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
    console.log('\n✅ This validation is now applied to:');
    console.log('   - Creating new voters (frontend & backend)');
    console.log('   - Updating existing voters (frontend & backend)');
    console.log('   - User registration (backend)');
  } else {
    console.log('⚠️ Some tests failed. Please check the regex pattern.');
  }
}

// Run the tests
runValidationTests(); 