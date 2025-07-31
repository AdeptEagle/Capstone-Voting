#!/usr/bin/env node

import mysql from 'mysql2/promise';

console.log('🔧 COMPREHENSIVE DATABASE FIX - Correct IDs Only');
console.log('==================================================\n');

// Use Railway environment variables
const dbConfig = {
  host: 'yamabiko.proxy.rlwy.net',
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: 30390,
  database: process.env.MYSQLDATABASE,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function fixDatabaseIds() {
  let connection;
  
  try {
    console.log('🔍 Connecting to Railway database...');
    console.log(`Host: ${process.env.MYSQLHOST}`);
    console.log(`Database: ${process.env.MYSQLDATABASE}`);
    console.log(`User: ${process.env.MYSQLUSER}`);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to Railway database\n');
    
    // STEP 1: Check current state
    console.log('📊 CURRENT DATABASE STATE:');
    console.log('==========================');
    
    const [currentDepartments] = await connection.execute('SELECT id, name FROM departments ORDER BY id');
    console.log('\n🏢 Current Departments:');
    currentDepartments.forEach(dept => {
      console.log(`   ${dept.id}: ${dept.name}`);
    });
    
    const [currentCourses] = await connection.execute('SELECT id, name, departmentId FROM courses ORDER BY departmentId, name');
    console.log('\n📚 Current Courses:');
    currentCourses.forEach(course => {
      console.log(`   ${course.id}: ${course.name} -> ${course.departmentId}`);
    });
    
    // STEP 2: Remove ALL existing data
    console.log('\n🗑️  CLEANING DATABASE:');
    console.log('=======================');
    
    await connection.execute('DELETE FROM courses');
    console.log('✅ All courses deleted');
    
    await connection.execute('DELETE FROM departments');
    console.log('✅ All departments deleted');
    
    // STEP 3: Create departments with CORRECT IDs
    console.log('\n🏢 CREATING DEPARTMENTS WITH CORRECT IDs:');
    console.log('==========================================');
    
    const departments = [
      { id: 'CBM', name: 'College of Business and Management' },
      { id: 'CCS', name: 'College of Computer Studies' },
      { id: 'CEA', name: 'College of Education and Arts' },
      { id: 'COE', name: 'College of Engineering' }
    ];
    
    for (const dept of departments) {
      await connection.execute(
        'INSERT INTO departments (id, name, created_by) VALUES (?, ?, ?)',
        [dept.id, dept.name, 'superadmin-001']
      );
      console.log(`✅ Department: ${dept.name} (${dept.id})`);
    }
    
    // STEP 4: Create courses with CORRECT department IDs
    console.log('\n📚 CREATING COURSES WITH CORRECT DEPARTMENT IDs:');
    console.log('==================================================');
    
    const courses = [
      // College of Business and Management (CBM)
      { id: 'BSA', name: 'BS in Accountancy', departmentId: 'CBM' },
      { id: 'BSBA-MM', name: 'BS in Business Administration Major in Marketing Management', departmentId: 'CBM' },
      { id: 'BSBA-HRDM', name: 'BS in Business Administration Major in Human Resource Development Management', departmentId: 'CBM' },
      { id: 'BSHM', name: 'BS in Hospitality Management', departmentId: 'CBM' },
      
      // College of Computer Studies (CCS)
      { id: 'BSIT', name: 'BS in Information Technology', departmentId: 'CCS' },
      
      // College of Education and Arts (CEA)
      { id: 'BEED', name: 'Bachelor in Elementary Education - General Education', departmentId: 'CEA' },
      { id: 'BMC', name: 'Bachelor in Mass Communications', departmentId: 'CEA' },
      { id: 'BSED-ENGLISH', name: 'Bachelor in Secondary Education Major in English', departmentId: 'CEA' },
      
      // College of Engineering (COE)
      { id: 'BSCE', name: 'BS in Civil Engineering', departmentId: 'COE' },
      { id: 'BSEE', name: 'BS in Electrical Engineering', departmentId: 'COE' },
      { id: 'BSME', name: 'BS in Mechanical Engineering', departmentId: 'COE' },
      { id: 'BSIE', name: 'BS in Industrial Engineering', departmentId: 'COE' }
    ];
    
    for (const course of courses) {
      await connection.execute(
        'INSERT INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?)',
        [course.id, course.name, course.departmentId, 'superadmin-001']
      );
      console.log(`✅ Course: ${course.name} -> ${course.departmentId}`);
    }
    
    // STEP 5: Verify the fix
    console.log('\n✅ VERIFICATION:');
    console.log('================');
    
    const [finalDepartments] = await connection.execute('SELECT id, name FROM departments ORDER BY id');
    console.log('\n🏢 Final Departments:');
    finalDepartments.forEach(dept => {
      console.log(`   ${dept.id}: ${dept.name}`);
    });
    
    const [finalCourses] = await connection.execute('SELECT id, name, departmentId FROM courses ORDER BY departmentId, name');
    console.log('\n📚 Final Courses:');
    finalCourses.forEach(course => {
      console.log(`   ${course.id}: ${course.name} -> ${course.departmentId}`);
    });
    
    // STEP 6: Summary
    console.log('\n📊 FINAL SUMMARY:');
    console.log('==================');
    const [summary] = await connection.execute(
      'SELECT departmentId, COUNT(*) as count FROM courses GROUP BY departmentId ORDER BY departmentId'
    );
    
    summary.forEach(dept => {
      console.log(`   ${dept.departmentId}: ${dept.count} courses`);
    });
    
    console.log('\n🎉 DATABASE FIX COMPLETED!');
    console.log('✅ All departments use correct IDs: CBM, CCS, CEA, COE');
    console.log('✅ All courses have matching department IDs');
    console.log('✅ No more case sensitivity issues');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixDatabaseIds(); 