#!/usr/bin/env node

import mysql from 'mysql2/promise';

console.log('🔧 Fixing Department Case Sensitivity');
console.log('=====================================\n');

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

async function fixDepartmentCase() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful\n');
    
    console.log('🔄 Updating course department assignments...');
    
    // Update engineering courses from 'CoE' to 'COE'
    const [engineeringResult] = await connection.execute(
      'UPDATE courses SET departmentId = ? WHERE departmentId = ?',
      ['COE', 'CoE']
    );
    
    if (engineeringResult.affectedRows > 0) {
      console.log(`✅ Updated ${engineeringResult.affectedRows} engineering courses from 'CoE' to 'COE'`);
    } else {
      console.log('ℹ️  No engineering courses found with 'CoE' department ID');
    }
    
    // Check if there are any other case mismatches
    const [courses] = await connection.execute(
      'SELECT id, name, departmentId FROM courses ORDER BY departmentId, name'
    );
    
    console.log('\n📚 Current course assignments:');
    courses.forEach(course => {
      console.log(`   ${course.id}: ${course.name} -> ${course.departmentId}`);
    });
    
    // Verify departments exist
    console.log('\n🏢 Verifying departments:');
    const [departments] = await connection.execute(
      'SELECT id, name FROM departments WHERE id IN ("COE", "CBM", "CCS", "CEA") ORDER BY name'
    );
    
    departments.forEach(dept => {
      console.log(`   ${dept.id}: ${dept.name}`);
    });
    
    console.log('\n✅ Department case sensitivity fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixDepartmentCase(); 