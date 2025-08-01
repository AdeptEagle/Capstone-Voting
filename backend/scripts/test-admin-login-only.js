import axios from 'axios';

async function testAdminLoginOnly() {
  try {
    console.log('🔍 Testing admin login endpoint only...');
    
    const loginData = {
      username: 'superadmin',
      password: 'superadmin123'
    };
    
    console.log('Sending login data:', loginData);
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/admin/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      }
    });
    
    console.log('✅ Admin login successful!');
    console.log('Response:', loginResponse.data);
    
  } catch (error) {
    console.log('❌ Admin login failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.error);
    console.log('Full error:', error.message);
    
    if (error.response?.data) {
      console.log('Response data:', error.response.data);
    }
  }
}

testAdminLoginOnly(); 