# Single Ballot System Test Suite

Comprehensive testing scripts for the new single ballot voting system.

## Test Scripts

### 1. Full Interactive Test (`test-single-ballot-system.js`)
Complete end-to-end test with user interaction prompts.

**Features:**
- ✅ Admin authentication
- ✅ User creation and authentication  
- ✅ Position creation
- ✅ Candidate creation
- ✅ Ballot creation with single ballot restriction
- ✅ Ballot state management (Start/Pause/Stop/End)
- ✅ User voting simulation
- ✅ Results calculation and display
- ✅ Vote history tracking
- ✅ Election history archiving

### 2. Quick Automated Test (`test-quick-ballot.js`)
Fast automated test without user interaction.

**Features:**
- 🚀 Fully automated
- ⚡ Quick execution (~30 seconds)
- 📊 Basic workflow validation
- 🎯 Core functionality testing

## Prerequisites

1. **Backend server running** on `http://localhost:5000`
2. **Admin account** with credentials:
   - Username: `admin`
   - Password: `admin123`
3. **Node.js** installed (v16+ recommended)

## Installation

```bash
# Install dependencies
npm install

# Or install node-fetch manually
npm install node-fetch@3.3.2
```

## Running Tests

### Option 1: Full Interactive Test
```bash
npm run test:ballot
# OR
node test-single-ballot-system.js
```

**What it does:**
1. 🔐 Authenticates admin
2. 👥 Creates 5 test users
3. 🏗️ Creates 4 positions (President, VP, Secretary, Treasurer)
4. 🙋 Creates 8 candidates across positions
5. 🗳️ Creates ballot with single ballot restriction check
6. ▶️ Starts ballot (enables voting)
7. 🗳️ Simulates 5 users voting
8. ⏹️ Stops and ends ballot
9. 📊 Shows detailed results and statistics
10. 📚 Displays election history

**Expected Output:**
```
╔══════════════════════════════════════════════════════════════╗
║                 SINGLE BALLOT SYSTEM TEST                   ║
║              Complete End-to-End Workflow                   ║
╚══════════════════════════════════════════════════════════════╝

🚀 PHASE 1: SETUP & AUTHENTICATION
✅ Admin authenticated successfully
✅ Created user: John Doe (TEST001)
✅ Created user: Jane Smith (TEST002)
...

🗳️ PHASE 3: BALLOT CREATION & ACTIVATION
✅ Created ballot: Test Student Council Election 2024
Current election status: pending
Ready to start the ballot? (Press Enter to continue)
✅ Ballot started successfully - Users can now vote!
...

🏆 FINAL RESULTS:
📍 President:
   🥇 Maria Garcia: 3 votes (60%)
   🥈 David Lee: 2 votes (40%)
```

### Option 2: Quick Automated Test
```bash
npm run test:quick
# OR
node test-quick-ballot.js
```

**What it does:**
- 🏃‍♂️ Runs complete workflow automatically
- ⚡ No user interaction required
- 📋 Tests core functionality
- ⏱️ Completes in ~30 seconds

**Expected Output:**
```
[10:30:45] ✅ Admin authenticated
[10:30:46] ✅ Positions ready
[10:30:47] ✅ 4 candidates ready
[10:30:48] ✅ Ballot created: Quick Test Election
[10:30:49] ✅ Ballot started - voting enabled!
[10:30:50] ✅ 2 voters ready
[10:30:51] ✅ 2 votes cast successfully
[10:30:52] ✅ Ballot ended and saved to history

📍 President:
   • Alice Johnson: 2 votes (100%)

🎉 QUICK TEST COMPLETED SUCCESSFULLY!
```

## Test Scenarios Covered

### Single Ballot Restriction ✅
- ❌ Prevents creating multiple active ballots
- ✅ Allows creation only when no active ballot exists
- ✅ Proper error messages for violations

### Ballot State Management ✅
- ✅ **PENDING** → **ACTIVE** (Start)
- ✅ **ACTIVE** → **PAUSED** (Pause)
- ✅ **PAUSED** → **ACTIVE** (Resume)
- ✅ **ACTIVE** → **STOPPED** (Stop)
- ✅ **STOPPED** → **ENDED** (End & Save to History)

### Voting Process ✅
- ✅ Users can vote only when ballot is ACTIVE
- ✅ Vote validation and storage
- ✅ Duplicate vote prevention
- ✅ Multi-position voting support

### Results & History ✅
- ✅ Real-time vote counting
- ✅ Percentage calculations
- ✅ Winner determination
- ✅ Vote history tracking
- ✅ Election archiving

## Troubleshooting

### Common Issues

**1. "Connection refused" errors**
```bash
# Make sure backend is running
cd backend
npm start
# Should see: Server running on port 5000
```

**2. "Admin authentication failed"**
```bash
# Check admin credentials in database
# Default: username=admin, password=admin123
```

**3. "Position/Candidate already exists"**
```bash
# This is normal - test continues with existing data
# Look for ⚠️ warnings in output
```

**4. "Only one ballot can exist at a time"**
```bash
# This is the expected behavior!
# Delete existing ballot through UI first, or:
# The test should clean up automatically
```

### Debug Mode
Add debug logs by setting environment variable:
```bash
DEBUG=true npm run test:ballot
```

## Test Data Cleanup

The tests create the following data:
- **Users**: TEST001-TEST005, QT001-QT002
- **Positions**: PRES, VPRES, SEC, TREAS
- **Candidates**: 8 test candidates
- **Elections**: Test elections in various states

**Manual Cleanup:**
1. Use admin interface to delete test elections
2. Delete test candidates from Candidates tab
3. Remove test users from user management
4. Clean up test positions if needed

**Automated Cleanup** (optional):
```bash
# Add cleanup script to package.json if needed
npm run cleanup:test-data
```

## Expected Test Duration

- **Full Interactive Test**: 5-10 minutes (with user prompts)
- **Quick Automated Test**: 30-60 seconds

## Success Criteria

### ✅ Test Passes If:
1. All phases complete without critical errors
2. Ballot state transitions work correctly
3. Users can vote when ballot is active
4. Results are calculated and saved
5. Single ballot restriction is enforced
6. Election history is maintained

### ❌ Test Fails If:
1. Authentication fails
2. Multiple ballots can be created simultaneously
3. Users can vote when ballot is not active
4. Vote counts are incorrect
5. State transitions fail
6. Results are not saved

## Integration with CI/CD

Add to your deployment pipeline:
```bash
# In your deploy script
echo "Testing single ballot system..."
npm install
npm run test:quick

if [ $? -eq 0 ]; then
    echo "✅ Single ballot system tests passed"
else
    echo "❌ Single ballot system tests failed"
    exit 1
fi
```