#!/usr/bin/env node

import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

console.log('🌱 Seeding Departments and Courses Data');
console.log('=======================================\n');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'voting_system',
  charset: 'utf8mb4',
  timezone: '+00:00',
  multipleStatements: true
};

async function seedDepartmentsAndCourses() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    // Get the superadmin ID (assuming it exists)
    const [superadminResult] = await connection.execute(
      'SELECT id FROM admins WHERE role = "superadmin" LIMIT 1'
    );
    
    if (superadminResult.length === 0) {
      throw new Error('No superadmin found. Please run create-database.js first.');
    }
    
    const superadminId = superadminResult[0].id;
    console.log(`👑 Using superadmin ID: ${superadminId}\n`);
    
    // 1. Create the new departments
    console.log('🏢 Creating departments...');
    const departments = [
      { id: 'CBM', name: 'College of Business and Management', created_by: superadminId },
      { id: 'CCS', name: 'College of Computer Studies', created_by: superadminId },
      { id: 'CEA', name: 'College of Education and Arts', created_by: superadminId },
      { id: 'COE', name: 'College of Engineering', created_by: superadminId }
    ];

    for (const dept of departments) {
      await connection.execute(
        `INSERT INTO departments (id, name, created_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [dept.id, dept.name, dept.created_by, dept.name]
      );
      console.log(`✅ Department: ${dept.name}`);
    }
    
    // 2. Create the courses
    console.log('\n📚 Creating courses...');
    const courses = [
      // College of Business and Management
      { id: 'BSHM', name: 'BS in Hospitality Management', departmentId: 'CBM', created_by: superadminId },
      { id: 'BSA', name: 'BS in Accountancy', departmentId: 'CBM', created_by: superadminId },
      { id: 'BSBA-MM', name: 'BS in Business Administration Major in Marketing Management', departmentId: 'CBM', created_by: superadminId },
      { id: 'BSBA-HRDM', name: 'BS in Business Administration Major in Human Resource Development Management', departmentId: 'CBM', created_by: superadminId },
      
      // College of Computer Studies
      { id: 'BSIT', name: 'BS in Information Technology', departmentId: 'CCS', created_by: superadminId },
      
      // College of Education and Arts
      { id: 'BEED', name: 'Bachelor in Elementary Education - General Education', departmentId: 'CEA', created_by: superadminId },
      { id: 'BMC', name: 'Bachelor in Mass Communications', departmentId: 'CEA', created_by: superadminId },
      { id: 'BSED-ENGLISH', name: 'Bachelor in Secondary Education Major in English', departmentId: 'CEA', created_by: superadminId },
      
      // College of Engineering
      { id: 'BSEE', name: 'BS in Electrical Engineering', departmentId: 'COE', created_by: superadminId },
      { id: 'BSCE', name: 'BS in Civil Engineering', departmentId: 'COE', created_by: superadminId },
      { id: 'BSME', name: 'BS in Mechanical Engineering', departmentId: 'COE', created_by: superadminId },
      { id: 'BSIE', name: 'BS in Industrial Engineering', departmentId: 'COE', created_by: superadminId }
    ];

    for (const course of courses) {
      await connection.execute(
        `INSERT INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [course.id, course.name, course.departmentId, course.created_by, course.name]
      );
      console.log(`✅ Course: ${course.name}`);
    }
    
    console.log('\n✅ Department and Course seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 4 Departments created/updated`);
    console.log(`   - 13 Courses created/updated`);
    console.log('\n🎯 Data will persist across:');
    console.log('   - Database cloning');
    console.log('   - Cloud deployments');
    console.log('   - System migrations');
    console.log('   - Fresh installations');
    
    console.log('\n💡 To run this script again:');
    console.log('   node backend/scripts/seed-departments-courses.js');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check database connection settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check database credentials');
      console.log('   - Verify database exists');
    }
    
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.log('Warning: Could not close database connection:', error.message);
      }
    }
  }
}

// Run the seeding
seedDepartmentsAndCourses(); 