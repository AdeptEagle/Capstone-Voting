#!/usr/bin/env node

import mysql from 'mysql2/promise';

console.log('🔄 Resetting Database with Correct Department-Course Relationships');
console.log('================================================================\n');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'voting_system',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function resetDatabaseFix() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    // Get the superadmin ID
    const [superadminResult] = await connection.execute(
      'SELECT id FROM admins WHERE role = "superadmin" LIMIT 1'
    );
    
    if (superadminResult.length === 0) {
      throw new Error('No superadmin found. Please run create-database.js first.');
    }
    
    const superadminId = superadminResult[0].id;
    console.log(`👑 Using superadmin ID: ${superadminId}\n`);
    
    console.log('🗑️  Clearing existing departments and courses...');
    
    // Clear existing data
    await connection.execute('DELETE FROM courses');
    await connection.execute('DELETE FROM departments WHERE id NOT IN ("superadmin-001")');
    
    console.log('✅ Cleared existing data\n');
    
    // Create departments with correct IDs
    console.log('🏢 Creating departments with correct IDs...');
    const departments = [
      { id: 'COE', name: 'College of Engineering', created_by: superadminId },
      { id: 'CBM', name: 'College of Business and Management', created_by: superadminId },
      { id: 'CCS', name: 'College of Computer Studies', created_by: superadminId },
      { id: 'CEA', name: 'College of Education and Arts', created_by: superadminId }
    ];

    for (const dept of departments) {
      await connection.execute(
        'INSERT INTO departments (id, name, created_by) VALUES (?, ?, ?)',
        [dept.id, dept.name, dept.created_by]
      );
      console.log(`✅ Created department: ${dept.name} (${dept.id})`);
    }
    
    // Create courses with correct department assignments
    console.log('\n📚 Creating courses with correct department assignments...');
    const courses = [
      // College of Engineering
      { id: 'BSEE', name: 'BS in Electrical Engineering', departmentId: 'COE', created_by: superadminId },
      { id: 'BSCE', name: 'BS in Civil Engineering', departmentId: 'COE', created_by: superadminId },
      { id: 'BSME', name: 'BS in Mechanical Engineering', departmentId: 'COE', created_by: superadminId },
      { id: 'BSIE', name: 'BS in Industrial Engineering', departmentId: 'COE', created_by: superadminId },
      
      // College of Business and Management
      { id: 'BSHM', name: 'BS in Hospitality Management', departmentId: 'CBM', created_by: superadminId },
      { id: 'BSA', name: 'BS in Accountancy', departmentId: 'CBM', created_by: superadminId },
      { id: 'BSBA-MM', name: 'BS in Business Administration Major in Marketing Management', departmentId: 'CBM', created_by: superadminId },
      { id: 'BSBA-HRDM', name: 'BS in Business Administration Major in Human Resource Development Management', departmentId: 'CBM', created_by: superadminId },
      
      // College of Computer Studies
      { id: 'BSIT', name: 'BS in Information Technology', departmentId: 'CCS', created_by: superadminId },
      
      // College of Education and Arts
      { id: 'BEEd', name: 'Bachelor in Elementary Education - General Education', departmentId: 'CEA', created_by: superadminId },
      { id: 'BMC', name: 'Bachelor in Mass Communications', departmentId: 'CEA', created_by: superadminId },
      { id: 'BSEd-English', name: 'Bachelor in Secondary Education Major in English', departmentId: 'CEA', created_by: superadminId }
    ];

    for (const course of courses) {
      await connection.execute(
        'INSERT INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?)',
        [course.id, course.name, course.departmentId, course.created_by]
      );
      console.log(`✅ Created course: ${course.name} -> ${course.departmentId}`);
    }
    
    console.log('\n✅ Database reset completed successfully!');
    
    // Verify the structure
    console.log('\n🔍 Verifying final structure:');
    const [finalDepartments] = await connection.execute(
      'SELECT id, name FROM departments WHERE id IN ("COE", "CBM", "CCS", "CEA") ORDER BY name'
    );
    
    for (const dept of finalDepartments) {
      console.log(`\n   ${dept.name} (${dept.id}):`);
      
      const [courses] = await connection.execute(
        'SELECT id, name FROM courses WHERE departmentId = ? ORDER BY name',
        [dept.id]
      );
      
      if (courses.length === 0) {
        console.log('      No courses found');
      } else {
        courses.forEach(course => {
          console.log(`      ${course.id}: ${course.name}`);
        });
      }
    }
    
    console.log('\n🎉 Database is now ready for user registration!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabaseFix(); 