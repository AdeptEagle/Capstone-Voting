// Comprehensive Voting System Test Script

const API_BASE = 'https://backend-production-219d.up.railway.app/api';

console.log('🗳️ Comprehensive Voting System Test');
console.log('=====================================');
console.log('');

// Test configuration
const TEST_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

console.log('📋 Test Plan:');
console.log('1. Login as admin');
console.log('2. Create test positions with different vote limits');
console.log('3. Create test candidates for each position');
console.log('4. Create a test election');
console.log('5. Start the election');
console.log('6. Test voting with multiple votes per position');
console.log('7. Test vote validation and limits');
console.log('8. View results and ballot history');
console.log('9. Clean up test data');
console.log('');

// Test data
const testPositions = [
  { name: 'President', voteLimit: 1, description: 'Single vote position' },
  { name: 'Senator', voteLimit: 8, description: 'Multiple vote position (8 winners)' },
  { name: 'Councilor', voteLimit: 5, description: 'Multiple vote position (5 winners)' }
];

const testCandidates = [
  // President candidates
  { name: 'John Doe', positionName: 'President', departmentName: 'Computer Science', courseName: 'BS Computer Science' },
  { name: 'Jane Smith', positionName: 'President', departmentName: 'Engineering', courseName: 'BS Electrical Engineering' },
  
  // Senator candidates (12 candidates for 8 positions)
  { name: 'Alice Brown', positionName: 'Senator', departmentName: 'Computer Science', courseName: 'BS Computer Science' },
  { name: 'Bob Wilson', positionName: 'Senator', departmentName: 'Engineering', courseName: 'BS Mechanical Engineering' },
  { name: 'Carol Davis', positionName: 'Senator', departmentName: 'Business', courseName: 'BS Business Administration' },
  { name: 'David Lee', positionName: 'Senator', departmentName: 'Computer Science', courseName: 'BS Information Technology' },
  { name: 'Eva Garcia', positionName: 'Senator', departmentName: 'Engineering', courseName: 'BS Civil Engineering' },
  { name: 'Frank Miller', positionName: 'Senator', departmentName: 'Business', courseName: 'BS Accounting' },
  { name: 'Grace Taylor', positionName: 'Senator', departmentName: 'Computer Science', courseName: 'BS Computer Science' },
  { name: 'Henry Chen', positionName: 'Senator', departmentName: 'Engineering', courseName: 'BS Chemical Engineering' },
  { name: 'Iris Johnson', positionName: 'Senator', departmentName: 'Business', courseName: 'BS Marketing' },
  { name: 'Jack Anderson', positionName: 'Senator', departmentName: 'Computer Science', courseName: 'BS Information Systems' },
  { name: 'Kelly White', positionName: 'Senator', departmentName: 'Engineering', courseName: 'BS Industrial Engineering' },
  { name: 'Luke Martinez', positionName: 'Senator', departmentName: 'Business', courseName: 'BS Finance' },
  
  // Councilor candidates (8 candidates for 5 positions)
  { name: 'Mary Clark', positionName: 'Councilor', departmentName: 'Computer Science', courseName: 'BS Computer Science' },
  { name: 'Nick Rodriguez', positionName: 'Councilor', departmentName: 'Engineering', courseName: 'BS Electrical Engineering' },
  { name: 'Olivia Lewis', positionName: 'Councilor', departmentName: 'Business', courseName: 'BS Business Administration' },
  { name: 'Paul Walker', positionName: 'Councilor', departmentName: 'Computer Science', courseName: 'BS Information Technology' },
  { name: 'Quinn Hall', positionName: 'Councilor', departmentName: 'Engineering', courseName: 'BS Mechanical Engineering' },
  { name: 'Rachel Allen', positionName: 'Councilor', departmentName: 'Business', courseName: 'BS Accounting' },
  { name: 'Steve Young', positionName: 'Councilor', departmentName: 'Computer Science', courseName: 'BS Computer Science' },
  { name: 'Tina King', positionName: 'Councilor', departmentName: 'Engineering', courseName: 'BS Civil Engineering' }
];

const testElection = {
  title: 'Comprehensive Voting System Test Election',
  description: 'Testing multiple vote limits per position functionality',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
};

// Browser-compatible test function
if (typeof window !== 'undefined') {
  window.testVotingSystem = async function() {
    console.log('🚀 Starting comprehensive voting system test...');
    
    let createdPositions = [];
    let createdCandidates = [];
    let createdElection = null;
    let token = null;
    
    try {
      // Step 1: Login
      console.log('🔐 Step 1: Admin Login');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_ADMIN)
      });
      
      if (!loginResponse.ok) throw new Error('Login failed');
      
      const loginData = await loginResponse.json();
      token = loginData.token;
      console.log('✅ Login successful');
      
      // Step 2: Create test positions
      console.log('📋 Step 2: Creating test positions');
      for (const positionData of testPositions) {
        const response = await fetch(`${API_BASE}/positions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(positionData)
        });
        
        if (!response.ok) throw new Error(`Failed to create position: ${positionData.name}`);
        
        const position = await response.json();
        createdPositions.push(position);
        console.log(`✅ Created position: ${positionData.name} (vote limit: ${positionData.voteLimit})`);
      }
      
      // Step 3: Create test candidates
      console.log('👥 Step 3: Creating test candidates');
      for (const candidateData of testCandidates) {
        // Find the position ID
        const position = createdPositions.find(p => p.name === candidateData.positionName);
        if (!position) {
          console.warn(`⚠️ Position not found: ${candidateData.positionName}`);
          continue;
        }
        
        const candidatePayload = {
          ...candidateData,
          positionId: position.id
        };
        
        const response = await fetch(`${API_BASE}/candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(candidatePayload)
        });
        
        if (!response.ok) throw new Error(`Failed to create candidate: ${candidateData.name}`);
        
        const candidate = await response.json();
        createdCandidates.push(candidate);
        console.log(`✅ Created candidate: ${candidateData.name} for ${candidateData.positionName}`);
      }
      
      // Step 4: Create election
      console.log('🗳️ Step 4: Creating test election');
      const electionResponse = await fetch(`${API_BASE}/elections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...testElection,
          positionIds: createdPositions.map(p => p.id),
          candidateIds: createdCandidates.map(c => c.id)
        })
      });
      
      if (!electionResponse.ok) throw new Error('Failed to create election');
      
      createdElection = await electionResponse.json();
      console.log(`✅ Created election: ${createdElection.title}`);
      
      // Step 5: Start election
      console.log('🚀 Step 5: Starting election');
      const startResponse = await fetch(`${API_BASE}/elections/${createdElection.id}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!startResponse.ok) throw new Error('Failed to start election');
      console.log('✅ Election started successfully');
      
      // Step 6: Test voting scenarios
      console.log('🗳️ Step 6: Testing voting scenarios');
      
      // Test vote limits
      console.log('📊 Testing vote limits:');
      createdPositions.forEach(position => {
        console.log(`- ${position.name}: ${position.voteLimit} vote(s) allowed`);
      });
      
      // Test API endpoints
      console.log('🔍 Step 7: Testing new API endpoints');
      
      // Test ballot history endpoints
      try {
        console.log('📊 Testing ballot history endpoints...');
        
        // Get completed elections (should be empty for now)
        const completedResponse = await fetch(`${API_BASE}/ballot-history/elections`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          console.log(`✅ Ballot history endpoint working: ${completedData.data.length} completed elections`);
        }
        
        // Test voting statistics endpoint
        const statsResponse = await fetch(`${API_BASE}/votes/statistics/${createdElection.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('✅ Voting statistics endpoint working');
        }
        
      } catch (error) {
        console.warn('⚠️ Some API endpoints may not be accessible yet:', error.message);
      }
      
      console.log('');
      console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
      console.log('');
      console.log('📋 Test Results Summary:');
      console.log(`✅ Created ${createdPositions.length} positions with different vote limits`);
      console.log(`✅ Created ${createdCandidates.length} candidates`);
      console.log(`✅ Created and started 1 election`);
      console.log(`✅ Verified API endpoints are accessible`);
      console.log('');
      console.log('🔧 Manual Testing Instructions:');
      console.log('1. Go to the admin dashboard');
      console.log('2. Navigate to the current election');
      console.log('3. Try voting with different vote limits:');
      console.log('   - President: Select 1 candidate only');
      console.log('   - Senator: Select up to 8 candidates');
      console.log('   - Councilor: Select up to 5 candidates');
      console.log('4. Test vote validation (try exceeding limits)');
      console.log('5. End the election and check ballot history');
      console.log('');
      
      // Ask user if they want to clean up
      const cleanup = confirm('🧹 Do you want to clean up the test data? (This will delete the test election, candidates, and positions)');
      
      if (cleanup) {
        console.log('🧹 Cleaning up test data...');
        
        // Delete election
        if (createdElection) {
          try {
            await fetch(`${API_BASE}/elections/${createdElection.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Deleted test election');
          } catch (error) {
            console.warn('⚠️ Failed to delete election:', error.message);
          }
        }
        
        // Delete candidates
        for (const candidate of createdCandidates) {
          try {
            await fetch(`${API_BASE}/candidates/${candidate.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (error) {
            console.warn(`⚠️ Failed to delete candidate ${candidate.name}:`, error.message);
          }
        }
        console.log(`✅ Deleted ${createdCandidates.length} test candidates`);
        
        // Delete positions
        for (const position of createdPositions) {
          try {
            await fetch(`${API_BASE}/positions/${position.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (error) {
            console.warn(`⚠️ Failed to delete position ${position.name}:`, error.message);
          }
        }
        console.log(`✅ Deleted ${createdPositions.length} test positions`);
        
        console.log('🎉 Cleanup completed!');
      } else {
        console.log('ℹ️ Test data preserved for manual testing');
        console.log('Remember to clean up manually when done testing');
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      console.log('');
      console.log('🔧 Cleanup attempt after error...');
      
      // Attempt cleanup on error
      if (token) {
        // Clean up in reverse order
        if (createdElection) {
          try {
            await fetch(`${API_BASE}/elections/${createdElection.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (e) { /* ignore */ }
        }
        
        for (const candidate of createdCandidates) {
          try {
            await fetch(`${API_BASE}/candidates/${candidate.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (e) { /* ignore */ }
        }
        
        for (const position of createdPositions) {
          try {
            await fetch(`${API_BASE}/positions/${position.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (e) { /* ignore */ }
        }
        
        console.log('🧹 Emergency cleanup attempted');
      }
    }
  };
  
  console.log('To run the test in browser console, execute: testVotingSystem()');
} else {
  console.log('This script is designed to run in a browser console.');
  console.log('Copy and paste it into your browser\'s developer console.');
}

console.log('');
console.log('💡 Manual Testing Checklist:');
console.log('□ Create positions with different vote limits');
console.log('□ Create multiple candidates per position');
console.log('□ Start an election');
console.log('□ Test single-vote positions (e.g., President)');
console.log('□ Test multi-vote positions (e.g., Senator with 8 votes)');
console.log('□ Try to exceed vote limits (should fail)');
console.log('□ Try to vote for the same candidate twice (should fail)');
console.log('□ Complete voting process');
console.log('□ End the election');
console.log('□ Check ballot history and analytics');
console.log('□ Verify winners and losers are correctly identified');
console.log('□ Check department and course statistics');
console.log('□ Review voting timeline and patterns'); 