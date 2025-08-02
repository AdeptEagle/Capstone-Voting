import { sequelize } from '../config/sequelize.js';
import '../models/sequelize/index.js';
import { Admin, Department, Position } from '../models/sequelize/index.js';

async function testSequelizeModels() {
  try {
    console.log('🧪 Testing Sequelize models...');
    
    // Test Admin model
    console.log('\n📋 Testing Admin model...');
    const adminCount = await Admin.count();
    console.log(`✅ Admin count: ${adminCount}`);
    
    // Test Department model
    console.log('\n📋 Testing Department model...');
    const deptCount = await Department.count();
    console.log(`✅ Department count: ${deptCount}`);
    
    // Test Position model
    console.log('\n📋 Testing Position model...');
    const posCount = await Position.count();
    console.log(`✅ Position count: ${posCount}`);
    
    // Test associations
    console.log('\n📋 Testing associations...');
    const adminWithDepts = await Admin.findOne({
      include: [
        { model: Department, as: 'departments' }
      ]
    });
    console.log(`✅ Admin with departments query: ${adminWithDepts ? 'Success' : 'No data'}`);
    
    // Test creating a test admin (if none exist)
    if (adminCount === 0) {
      console.log('\n📋 Creating test admin...');
      const testAdmin = await Admin.create({
        id: 'test-admin-123',
        username: 'testadmin',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log(`✅ Test admin created: ${testAdmin.username}`);
    }
    
    console.log('\n✅ All Sequelize model tests passed!');
    
  } catch (error) {
    console.error('❌ Sequelize model test failed:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

testSequelizeModels(); 