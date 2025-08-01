import axios from 'axios';

async function testCors() {
  try {
    console.log('🔍 Testing CORS and connectivity...');
    
    // Test basic connectivity
    console.log('Testing basic connectivity...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check successful:', healthResponse.data);
    
    // Test API endpoint
    console.log('Testing API endpoint...');
    const apiResponse = await axios.get('http://localhost:3000/api/positions');
    console.log('✅ API endpoint accessible');
    
    // Test admin login endpoint specifically
    console.log('Testing admin login endpoint...');
    const loginData = {
      username: 'superadmin',
      password: 'superadmin123'
    };
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/admin/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      }
    });
    
    console.log('✅ Admin login endpoint working:', loginResponse.data);
    
  } catch (error) {
    console.log('❌ Test failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.error);
    console.log('Full error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend server is not running on port 3000');
    } else if (error.response?.status === 401) {
      console.log('💡 Authentication failed - check credentials');
    } else if (error.response?.status === 404) {
      console.log('💡 Endpoint not found - check route configuration');
    }
  }
}

testCors(); 