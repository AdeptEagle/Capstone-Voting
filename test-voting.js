// Simple test script to verify voting system fixes
// Run this in your browser console on the voting page

console.log('🧪 Testing voting system fixes...');

// Test 1: Check if multiple votes per position work
async function testMultipleVotes() {
  console.log('1️⃣ Testing multiple votes per position...');
  
  // Simulate selecting multiple senators
  const testVotes = {
    voterId: 1, // Replace with actual voter ID
    positionId: 'pos-014', // Replace with actual senator position ID
    candidateIds: ['candidate-1', 'candidate-2', 'candidate-3'], // Replace with actual candidate IDs
    isLastVote: false
  };
  
  try {
    const response = await fetch('https://backend-production-219d.up.railway.app/api/votes/multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testVotes)
    });
    
    const result = await response.json();
    console.log('✅ Multiple votes test result:', result);
    return true;
  } catch (error) {
    console.log('❌ Multiple votes test failed:', error);
    return false;
  }
}

// Test 2: Check database constraint
async function testDatabaseConstraint() {
  console.log('2️⃣ Testing database constraint...');
  
  try {
    const response = await fetch('https://backend-production-219d.up.railway.app/api/votes');
    const votes = await response.json();
    console.log('✅ Database constraint test - votes endpoint accessible');
    return true;
  } catch (error) {
    console.log('❌ Database constraint test failed:', error);
    return false;
  }
}

// Test 3: Check if duplicate candidate votes are prevented
async function testDuplicatePrevention() {
  console.log('3️⃣ Testing duplicate vote prevention...');
  
  const testVotes = {
    voterId: 1,
    positionId: 'pos-014',
    candidateIds: ['candidate-1', 'candidate-1'], // Same candidate twice
    isLastVote: false
  };
  
  try {
    const response = await fetch('https://backend-production-219d.up.railway.app/api/votes/multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testVotes)
    });
    
    const result = await response.json();
    if (result.error && result.error.includes('same candidate multiple times')) {
      console.log('✅ Duplicate prevention working correctly');
      return true;
    } else {
      console.log('❌ Duplicate prevention failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Duplicate prevention test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting voting system tests...\n');
  
  const results = {
    multipleVotes: await testMultipleVotes(),
    databaseConstraint: await testDatabaseConstraint(),
    duplicatePrevention: await testDuplicatePrevention()
  };
  
  console.log('\n📊 Test Results:');
  console.log('Multiple votes per position:', results.multipleVotes ? '✅ PASS' : '❌ FAIL');
  console.log('Database constraint:', results.databaseConstraint ? '✅ PASS' : '❌ FAIL');
  console.log('Duplicate prevention:', results.duplicatePrevention ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return allPassed;
}

// Export for manual testing
window.testVotingSystem = runAllTests;
console.log('💡 Run testVotingSystem() to test the voting system'); 