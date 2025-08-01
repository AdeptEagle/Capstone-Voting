#!/usr/bin/env node

// Simple test script to verify department endpoints work
const testDepartments = async () => {
  const baseUrl = 'https://backend-production-219d.up.railway.app/api';
  
  console.log('🧪 Testing Department Endpoints');
  console.log('================================\n');
  
  try {
    console.log('1. Testing /departments endpoint...');
    const deptResponse = await fetch(`${baseUrl}/departments`);
    console.log(`   Status: ${deptResponse.status} ${deptResponse.statusText}`);
    
    if (deptResponse.ok) {
      const departments = await deptResponse.json();
      console.log(`   ✅ Found ${departments.length} departments`);
      departments.forEach(dept => {
        console.log(`      - ${dept.name} (${dept.id})`);
      });
    } else {
      console.log(`   ❌ Error: ${await deptResponse.text()}`);
    }
    
    console.log('\n2. Testing /departments/all-with-courses endpoint...');
    const withCoursesResponse = await fetch(`${baseUrl}/departments/all-with-courses`);
    console.log(`   Status: ${withCoursesResponse.status} ${withCoursesResponse.statusText}`);
    
    if (withCoursesResponse.ok) {
      const departmentsWithCourses = await withCoursesResponse.json();
      console.log(`   ✅ Found ${departmentsWithCourses.length} departments with courses`);
      departmentsWithCourses.forEach(dept => {
        console.log(`      - ${dept.name} (${dept.courses?.length || 0} courses)`);
        if (dept.courses && dept.courses.length > 0) {
          dept.courses.forEach(course => {
            console.log(`        • ${course.name} (${course.id})`);
          });
        }
      });
    } else {
      console.log(`   ❌ Error: ${await withCoursesResponse.text()}`);
    }
    
    console.log('\n3. Testing a specific department courses...');
    // Try first department
    const firstDeptResponse = await fetch(`${baseUrl}/departments`);
    if (firstDeptResponse.ok) {
      const departments = await firstDeptResponse.json();
      if (departments.length > 0) {
        const firstDeptId = departments[0].id;
        const coursesResponse = await fetch(`${baseUrl}/departments/${firstDeptId}/courses`);
        console.log(`   Status: ${coursesResponse.status} ${coursesResponse.statusText}`);
        
        if (coursesResponse.ok) {
          const courses = await coursesResponse.json();
          console.log(`   ✅ Found ${courses.length} courses for ${departments[0].name}`);
          courses.forEach(course => {
            console.log(`      - ${course.name} (${course.id})`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

console.log('Starting department endpoints test...\n');
testDepartments(); 