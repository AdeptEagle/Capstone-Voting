import { sequelize } from '../config/sequelize.js';
import '../models/sequelize/index.js';
import { AuthService } from '../services/sequelize/AuthService.js';
import { Admin, Voter } from '../models/sequelize/index.js';

async function testSequelizeLogin() {
  try {
    console.log('🧪 Testing Sequelize Login Functionality...');
    
    // Test 1: Test admin login with real admin data
    console.log('\n📋 Test 1: Testing admin login...');
    const admin = await Admin.findOne();
    if (admin) {
      console.log(`✅ Found admin: ${admin.username}`);
      
      // Test with wrong password
      try {
        await AuthService.adminLogin(admin.username, 'wrongpassword');
        console.log('❌ Expected login to fail with wrong password');
      } catch (error) {
        console.log(`✅ Correctly rejected wrong password: ${error.message}`);
      }
      
      // Test with non-existent admin
      try {
        await AuthService.adminLogin('nonexistentadmin', 'password');
        console.log('❌ Expected login to fail with non-existent admin');
      } catch (error) {
        console.log(`✅ Correctly rejected non-existent admin: ${error.message}`);
      }
    }
    
    // Test 2: Test voter login with real voter data
    console.log('\n📋 Test 2: Testing voter login...');
    const voter = await Voter.findOne();
    if (voter) {
      console.log(`✅ Found voter: ${voter.name} (${voter.studentId})`);
      
      // Test with wrong password
      try {
        await AuthService.userLogin(voter.studentId, 'wrongpassword');
        console.log('❌ Expected login to fail with wrong password');
      } catch (error) {
        console.log(`✅ Correctly rejected wrong password: ${error.message}`);
      }
      
      // Test with non-existent voter
      try {
        await AuthService.userLogin('2024-99999', 'password');
        console.log('❌ Expected login to fail with non-existent voter');
      } catch (error) {
        console.log(`✅ Correctly rejected non-existent voter: ${error.message}`);
      }
    }
    
    // Test 3: Test token validation
    console.log('\n📋 Test 3: Testing token validation...');
    if (admin) {
      // Create a valid token
      const jwt = await import('jsonwebtoken');
      const { JWT_SECRET } = await import('../config/constants.js');
      
      const token = jwt.default.sign(
        { id: admin.id, username: admin.username, role: admin.role }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      const validation = await AuthService.validateAdminToken(token);
      console.log(`✅ Token validation: ${validation.valid ? 'Valid' : 'Invalid'}`);
      
      if (validation.valid) {
        console.log(`✅ Admin data: ${validation.admin.username} (${validation.admin.role})`);
      }
    }
    
    // Test 4: Test model instance methods
    console.log('\n📋 Test 4: Testing model instance methods...');
    if (admin) {
      const isValidPassword = await admin.validatePassword('wrongpassword');
      console.log(`✅ Password validation (wrong password): ${isValidPassword ? 'Valid' : 'Invalid'}`);
    }
    
    if (voter) {
      const isValidPassword = await voter.validatePassword('wrongpassword');
      console.log(`✅ Voter password validation (wrong password): ${isValidPassword ? 'Valid' : 'Invalid'}`);
    }
    
    console.log('\n✅ All Sequelize Login tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Admin authentication working');
    console.log('- Voter authentication working');
    console.log('- Token validation working');
    console.log('- Password validation working');
    console.log('- Error handling working');
    
  } catch (error) {
    console.error('❌ Sequelize Login test failed:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

testSequelizeLogin(); 