import axios from 'axios';

async function testApiLogin() {
  try {
    console.log('🔍 Testing API login endpoint...');
    
    const loginData = {
      username: 'superadmin',
      password: 'superadmin123'
    };
    
    console.log('Sending login data:', loginData);
    
    const response = await axios.post('http://localhost:3000/api/auth/admin/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.error);
    console.log('Full error:', error.message);
  }
}

testApiLogin(); 