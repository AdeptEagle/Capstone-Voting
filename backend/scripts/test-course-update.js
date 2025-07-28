import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testCourseUpdate() {
  try {
    console.log('🧪 Testing Course Update Functionality...\n');
    
    // First, get all courses to find one to update
    console.log('1. Fetching courses...');
    try {
      const coursesResponse = await axios.get(`${BASE_URL}/courses`);
      const courses = coursesResponse.data;
      
      if (courses.length === 0) {
        console.log('❌ No courses found. Please create a course first.');
        return;
      }
      
      const testCourse = courses[0];
      console.log(`✅ Found course: ${testCourse.name} (ID: ${testCourse.id})`);
      
      // Test update with valid data
      console.log('\n2. Testing course update...');
      const updateData = {
        name: `${testCourse.name} (Updated)`,
        departmentId: testCourse.departmentId
      };
      
      console.log('Update data:', updateData);
      
      const updateResponse = await axios.put(`${BASE_URL}/courses/${testCourse.id}`, updateData);
      console.log('✅ Course update successful:', updateResponse.data);
      
      // Test update with missing departmentId
      console.log('\n3. Testing course update with missing departmentId...');
      try {
        await axios.put(`${BASE_URL}/courses/${testCourse.id}`, { name: 'Test Course' });
        console.log('❌ Should have failed with missing departmentId');
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Correctly rejected missing departmentId:', error.response.data.error);
        } else {
          console.log('❌ Unexpected error:', error.response?.data);
        }
      }
      
      // Test update with missing name
      console.log('\n4. Testing course update with missing name...');
      try {
        await axios.put(`${BASE_URL}/courses/${testCourse.id}`, { departmentId: testCourse.departmentId });
        console.log('❌ Should have failed with missing name');
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('✅ Correctly rejected missing name:', error.response.data.error);
        } else {
          console.log('❌ Unexpected error:', error.response?.data);
        }
      }
      
      console.log('\n🎉 Course update tests completed!');
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Server not running. Please start the server first:');
        console.log('   npm start');
        return;
      } else if (error.response?.status === 401) {
        console.log('❌ Authentication required. The course update endpoint requires admin authentication.');
        console.log('   This test script is for API testing only.');
        return;
      } else {
        console.log('❌ Error fetching courses:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCourseUpdate(); 