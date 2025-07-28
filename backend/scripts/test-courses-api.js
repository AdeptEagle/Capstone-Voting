#!/usr/bin/env node

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function testCoursesAPI() {
  console.log('🧪 Testing Courses API...\n');

  try {
    // Test 1: Get all courses
    console.log('1. Testing GET /courses...');
    const allCourses = await axios.get(`${API_BASE_URL}/courses`);
    console.log(`✅ Success: Found ${allCourses.data.length} courses`);
    
    if (allCourses.data.length > 0) {
      const firstCourse = allCourses.data[0];
      console.log(`   Sample course: ${firstCourse.name} (Dept: ${firstCourse.departmentName})`);
    }

    // Test 2: Get courses by department
    console.log('\n2. Testing GET /courses/department/:departmentId...');
    
    // Get departments first
    const departments = await axios.get(`${API_BASE_URL}/departments`);
    console.log(`   Found ${departments.data.length} departments`);
    
    if (departments.data.length > 0) {
      const firstDept = departments.data[0];
      console.log(`   Testing with department: ${firstDept.name} (${firstDept.id})`);
      
      const coursesByDept = await axios.get(`${API_BASE_URL}/courses/department/${firstDept.id}`);
      console.log(`✅ Success: Found ${coursesByDept.data.length} courses in department`);
      
      coursesByDept.data.forEach(course => {
        console.log(`   - ${course.name}`);
      });
    }

    // Test 3: Test with invalid department ID
    console.log('\n3. Testing with invalid department ID...');
    try {
      await axios.get(`${API_BASE_URL}/courses/department/invalid-id`);
      console.log('❌ Should have failed with invalid ID');
    } catch (error) {
      if (error.response?.status === 500) {
        console.log('✅ Correctly handled invalid department ID');
      } else {
        console.log(`⚠️ Unexpected error: ${error.response?.status}`);
      }
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testCoursesAPI(); 