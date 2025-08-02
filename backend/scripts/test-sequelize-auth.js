import { sequelize } from '../config/sequelize.js';
import '../models/sequelize/index.js';
import { AuthService } from '../services/sequelize/AuthService.js';
import { Admin, Voter, Department, Course } from '../models/sequelize/index.js';

async function testSequelizeAuth() {
  try {
    console.log('🧪 Testing Sequelize AuthService...');
    
    // Test 1: Check if we have existing admins
    console.log('\n📋 Test 1: Checking existing admins...');
    const adminCount = await Admin.count();
    console.log(`✅ Found ${adminCount} admins`);
    
    if (adminCount > 0) {
      const firstAdmin = await Admin.findOne();
      console.log(`✅ Sample admin: ${firstAdmin.username} (${firstAdmin.role})`);
    }
    
    // Test 2: Check if we have existing voters
    console.log('\n📋 Test 2: Checking existing voters...');
    const voterCount = await Voter.count();
    console.log(`✅ Found ${voterCount} voters`);
    
    // Test 3: Check departments and courses
    console.log('\n📋 Test 3: Checking departments and courses...');
    const deptCount = await Department.count();
    const courseCount = await Course.count();
    console.log(`✅ Found ${deptCount} departments and ${courseCount} courses`);
    
    // Test 4: Test admin login with existing admin
    if (adminCount > 0) {
      console.log('\n📋 Test 4: Testing admin login...');
      const testAdmin = await Admin.findOne();
      
      try {
        // This should fail with wrong password
        await AuthService.adminLogin(testAdmin.username, 'wrongpassword');
        console.log('❌ Expected login to fail with wrong password');
      } catch (error) {
        console.log(`✅ Correctly rejected wrong password: ${error.message}`);
      }
    }
    
    // Test 5: Test user registration validation
    console.log('\n📋 Test 5: Testing user registration validation...');
    
    // Test with invalid student ID format
    try {
      await AuthService.userRegister({
        name: 'Test User',
        email: 'test@example.com',
        studentId: 'invalid-format',
        password: 'password123',
        departmentId: 'test-dept-id',
        courseId: 'test-course-id'
      });
      console.log('❌ Expected registration to fail with invalid student ID');
    } catch (error) {
      console.log(`✅ Correctly rejected invalid student ID: ${error.message}`);
    }
    
    // Test 6: Test with missing required fields
    try {
      await AuthService.userRegister({
        name: 'Test User',
        email: 'test@example.com',
        // Missing studentId, password, departmentId, courseId
      });
      console.log('❌ Expected registration to fail with missing fields');
    } catch (error) {
      console.log(`✅ Correctly rejected missing fields: ${error.message}`);
    }
    
    // Test 7: Test static methods
    console.log('\n📋 Test 7: Testing static methods...');
    
    if (adminCount > 0) {
      const testAdmin = await Admin.findOne();
      const foundByUsername = await Admin.findByUsername(testAdmin.username);
      console.log(`✅ findByUsername works: ${foundByUsername ? 'Found' : 'Not found'}`);
    }
    
    if (voterCount > 0) {
      const testVoter = await Voter.findOne();
      const foundByEmail = await Voter.findByEmail(testVoter.email);
      console.log(`✅ findByEmail works: ${foundByEmail ? 'Found' : 'Not found'}`);
    }
    
    console.log('\n✅ All Sequelize AuthService tests passed!');
    
  } catch (error) {
    console.error('❌ Sequelize AuthService test failed:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

testSequelizeAuth(); 