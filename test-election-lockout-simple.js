// Simple Election Lockout Test (Browser Compatible)

const API_BASE = 'https://backend-production-219d.up.railway.app/api';

console.log('🚀 Election Lockout System Test');
console.log('================================');
console.log('');
console.log('Instructions:');
console.log('1. Copy this script and run it in your browser console');
console.log('2. Or use this as a manual testing guide');
console.log('');

// Test configuration
const TEST_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

console.log('Step 1: Login as admin');
console.log(`POST ${API_BASE}/auth/login`);
console.log('Body:', JSON.stringify(TEST_ADMIN, null, 2));
console.log('');

// Create test election with 3-minute duration
const now = new Date();
const endTime = new Date(now.getTime() + (3 * 60 * 1000)); // 3 minutes from now

const electionData = {
  title: 'Lockout Test Election',
  description: 'Testing automatic election lockout system - 3 minute duration',
  startTime: now.toISOString(),
  endTime: endTime.toISOString(),
  positionIds: [], // Empty for test
  candidateIds: [] // Empty for test
};

console.log('Step 2: Create test election');
console.log(`POST ${API_BASE}/elections`);
console.log(`Headers: Authorization: Bearer YOUR_TOKEN_HERE`);
console.log('Body:', JSON.stringify(electionData, null, 2));
console.log(`Election End Time: ${endTime.toLocaleString()}`);
console.log('');

console.log('Step 3: Start election');
console.log(`POST ${API_BASE}/elections/ELECTION_ID/start`);
console.log(`Headers: Authorization: Bearer YOUR_TOKEN_HERE`);
console.log('');

console.log('Step 4: Monitor election status');
console.log(`GET ${API_BASE}/elections/ELECTION_ID`);
console.log(`GET ${API_BASE}/elections/ELECTION_ID/countdown`);
console.log(`GET ${API_BASE}/elections/timers/active`);
console.log('');

console.log('Expected Results:');
console.log('- Election should automatically end after 3 minutes');
console.log('- Status should change from "active" to "ended"');
console.log('- Timer should be removed from active timers list');
console.log('- Backend logs should show automatic ending');
console.log('');

// Browser-compatible test function
if (typeof window !== 'undefined') {
  window.testElectionLockout = async function() {
    console.log('🔐 Starting browser-based lockout test...');
    
    try {
      // Step 1: Login
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_ADMIN)
      });
      
      if (!loginResponse.ok) throw new Error('Login failed');
      
      const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log('✅ Login successful');
      
      // Step 2: Create election
      const createResponse = await fetch(`${API_BASE}/elections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(electionData)
      });
      
      if (!createResponse.ok) throw new Error('Election creation failed');
      
      const electionResult = await createResponse.json();
      const electionId = electionResult.id;
      console.log(`✅ Election created: ${electionId}`);
      console.log(`📅 Will end at: ${endTime.toLocaleString()}`);
      
      // Step 3: Start election
      const startResponse = await fetch(`${API_BASE}/elections/${electionId}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!startResponse.ok) throw new Error('Election start failed');
      console.log('✅ Election started');
      
      // Step 4: Monitor election
      console.log('⏰ Monitoring election (will check every 30 seconds)...');
      
      const monitor = setInterval(async () => {
        try {
          // Check status
          const statusResponse = await fetch(`${API_BASE}/elections/${electionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const statusData = await statusResponse.json();
          
          // Check countdown
          const countdownResponse = await fetch(`${API_BASE}/elections/${electionId}/countdown`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const countdownData = await countdownResponse.json();
          
          console.log(`📊 Status: ${statusData.status}`);
          
          if (countdownData.expired) {
            console.log('⏰ Election has EXPIRED');
          } else if (countdownData.timeRemaining) {
            const time = countdownData.timeRemaining;
            console.log(`⏰ Time remaining: ${time.minutes}m ${time.seconds}s`);
          }
          
          if (statusData.status === 'ended') {
            console.log('🎉 SUCCESS: Election automatically ended!');
            clearInterval(monitor);
            
            // Cleanup
            console.log('🧹 Cleaning up...');
            await fetch(`${API_BASE}/elections/${electionId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Test completed and cleaned up');
          }
        } catch (error) {
          console.error('❌ Monitoring error:', error);
        }
      }, 30000);
      
      // Stop monitoring after 5 minutes max
      setTimeout(() => {
        clearInterval(monitor);
        console.log('⏰ Monitoring stopped (timeout)');
      }, 5 * 60 * 1000);
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  };
  
  console.log('To run the test in browser console, execute: testElectionLockout()');
}

console.log('Manual Testing Steps:');
console.log('====================');
console.log('1. Open browser developer tools');
console.log('2. Go to Network tab');
console.log('3. Create a short-duration election (2-3 minutes)');
console.log('4. Start the election');
console.log('5. Wait and observe the backend logs');
console.log('6. Check if election status changes to "ended" automatically');
console.log('7. Verify timer APIs work correctly');
console.log('');

console.log('Expected Backend Logs:');
console.log('- "🕐 Initializing Election Timer Service..."');
console.log('- "⏰ Started timer for election [ID]..."');
console.log('- "⏰ Timer expired for election [ID], ending now..."');
console.log('- "✅ Election [ID] automatically ended at [timestamp]"'); 