// Simple test to verify course validation logic
console.log('🧪 Testing Course Validation Logic...\n');

// Test data
const testCases = [
  {
    name: 'Valid course data',
    data: { name: 'BS Computer Science', departmentId: 'dept-001' },
    expected: 'PASS',
    description: 'Valid course with name and departmentId'
  },
  {
    name: 'Missing name',
    data: { departmentId: 'dept-001' },
    expected: 'FAIL',
    description: 'Course name is required'
  },
  {
    name: 'Missing departmentId',
    data: { name: 'BS Computer Science' },
    expected: 'FAIL',
    description: 'Department ID is required'
  },
  {
    name: 'Empty data',
    data: {},
    expected: 'FAIL',
    description: 'Both name and departmentId are required'
  },
  {
    name: 'Empty name',
    data: { name: '', departmentId: 'dept-001' },
    expected: 'FAIL',
    description: 'Course name cannot be empty'
  },
  {
    name: 'Empty departmentId',
    data: { name: 'BS Computer Science', departmentId: '' },
    expected: 'FAIL',
    description: 'Department ID cannot be empty'
  }
];

// Validation function (same logic as backend)
function validateCourseData(courseData) {
  if (!courseData.name) {
    return { valid: false, error: 'Course name is required' };
  }
  
  if (!courseData.departmentId) {
    return { valid: false, error: 'Department ID is required' };
  }
  
  return { valid: true };
}

// Run tests
let passed = 0;
let total = 0;

for (const testCase of testCases) {
  const result = validateCourseData(testCase.data);
  const expected = testCase.expected === 'PASS';
  
  if (result.valid === expected) {
    console.log(`✅ PASS: ${testCase.description}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${testCase.description}`);
    console.log(`   Expected: ${testCase.expected}, Got: ${result.valid ? 'PASS' : 'FAIL'}`);
    if (!result.valid) {
      console.log(`   Error: ${result.error}`);
    }
  }
  total++;
}

console.log(`\n📊 Results: ${passed}/${total} tests passed`);

if (passed === total) {
  console.log('🎉 All validation tests passed! The course validation logic is working correctly.');
} else {
  console.log('⚠️ Some tests failed. Please check the validation logic.');
} 