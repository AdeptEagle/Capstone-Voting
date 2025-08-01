#!/usr/bin/env node

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

console.log('🚀 Creating Complete Voting System Database');
console.log('==========================================\n');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  charset: 'utf8mb4',
  timezone: '+00:00',
  multipleStatements: true
};

const DB_NAME = 'voting_system';

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔍 Testing MySQL connection...');
    connection = await mysql.createConnection({
      ...dbConfig,
      multipleStatements: true
    });
    console.log('✅ MySQL connection successful\n');
    
    console.log('🏗️ Creating database and tables...');
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' created/verified`);
    
    // Close the current connection and create a new one with the database selected
    await connection.end();
    connection = await mysql.createConnection({
      ...dbConfig,
      database: DB_NAME,
      multipleStatements: true
    });
    
    // Create all tables
    const tables = [
      {
        name: 'admins',
        sql: `CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(36) PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'departments',
        sql: `CREATE TABLE IF NOT EXISTS departments (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'courses',
        sql: `CREATE TABLE IF NOT EXISTS courses (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          departmentId VARCHAR(36) NOT NULL,
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'positions',
        sql: `CREATE TABLE IF NOT EXISTS positions (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          voteLimit INT NOT NULL DEFAULT 1,
          displayOrder INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'candidates',
        sql: `CREATE TABLE IF NOT EXISTS candidates (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          departmentId VARCHAR(36),
          courseId VARCHAR(36),
          photoUrl TEXT,
          description TEXT,
          displayOrder INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
          FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
        )`
      },
      {
        name: 'voters',
        sql: `CREATE TABLE IF NOT EXISTS voters (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          studentId VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255),
          departmentId VARCHAR(36),
          courseId VARCHAR(36),
          hasVoted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
          FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
        )`
      },
      {
        name: 'elections',
        sql: `CREATE TABLE IF NOT EXISTS elections (
          id VARCHAR(20) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          startTime DATETIME NOT NULL,
          endTime DATETIME NOT NULL,
          status ENUM('pending', 'active', 'paused', 'stopped', 'ended', 'cancelled') DEFAULT 'pending',
          created_by VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
        )`
      },
      {
        name: 'election_positions',
        sql: `CREATE TABLE IF NOT EXISTS election_positions (
          id VARCHAR(36) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          UNIQUE KEY unique_election_position (electionId, positionId)
        )`
      },
      {
        name: 'election_candidates',
        sql: `CREATE TABLE IF NOT EXISTS election_candidates (
          id VARCHAR(36) PRIMARY KEY,
          electionId VARCHAR(20) NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          UNIQUE KEY unique_election_candidate (electionId, candidateId)
        )`
      },
      {
        name: 'votes',
        sql: `CREATE TABLE IF NOT EXISTS votes (
          id VARCHAR(36) PRIMARY KEY,
          voterId INT NOT NULL,
          electionId VARCHAR(20) NOT NULL,
          candidateId VARCHAR(36) NOT NULL,
          positionId VARCHAR(36) NOT NULL,
          isLastVote BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (voterId) REFERENCES voters(id) ON DELETE CASCADE,
          FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
          FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
          FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
          UNIQUE KEY unique_vote (voterId, electionId, positionId, candidateId)
        )`
      },
      {
        name: 'password_reset_tokens',
        sql: `CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          token VARCHAR(255) NOT NULL UNIQUE,
          user_type ENUM('admin', 'voter') NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_token (token),
          INDEX idx_email (email),
          INDEX idx_expires (expires_at)
        )`
      }
    ];
    
    for (const table of tables) {
      await connection.execute(table.sql);
      console.log(`✅ Table '${table.name}' created/verified`);
    }
    
    console.log('\n🌱 Seeding database with default data...');
    
    // 1. Create superadmin - DevEagle
    console.log('👑 Creating superadmin account...');
    const superadminPassword = await bcrypt.hash('devEagle123', 10);
    await connection.execute(
      `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?, password = ?`,
      ['superadmin-001', 'DevEagle', 'devEagle@votingsystem.com', superadminPassword, 'superadmin', 'superadmin', superadminPassword]
    );
    
    // 2. Create departments with specific IDs
    console.log('🏢 Creating departments...');
    const departments = [
      { id: 'CBM', name: 'College of Business and Management', created_by: 'superadmin-001' },
      { id: 'CCS', name: 'College of Computer Studies', created_by: 'superadmin-001' },
      { id: 'CEA', name: 'College of Education and Arts', created_by: 'superadmin-001' },
      { id: 'CoE', name: 'College of Engineering', created_by: 'superadmin-001' }
    ];

    for (const dept of departments) {
      await connection.execute(
        `INSERT INTO departments (id, name, created_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [dept.id, dept.name, dept.created_by, dept.name]
      );
    }
    
    // 3. Create courses with specific IDs
    console.log('📚 Creating courses...');
    const courses = [
      // College of Business and Management
      { id: 'BSHM', name: 'BS in Hospitality Management', departmentId: 'CBM', created_by: 'superadmin-001' },
      { id: 'BSA', name: 'BS in Accountancy', departmentId: 'CBM', created_by: 'superadmin-001' },
      { id: 'BSBA-MM', name: 'BS in Business Administration Major in Marketing Management', departmentId: 'CBM', created_by: 'superadmin-001' },
      { id: 'BSBA-HRDM', name: 'BS in Business Administration Major in Human Resource Development Management', departmentId: 'CBM', created_by: 'superadmin-001' },
      
      // College of Computer Studies
      { id: 'BSIT', name: 'BS in Information Technology', departmentId: 'CCS', created_by: 'superadmin-001' },
      
      // College of Education and Arts
      { id: 'BEEd', name: 'Bachelor in Elementary Education - General Education', departmentId: 'CEA', created_by: 'superadmin-001' },
      { id: 'BSEd-English', name: 'Bachelor in Secondary Education Major in English', departmentId: 'CEA', created_by: 'superadmin-001' },
      { id: 'BMC', name: 'Bachelor in Mass Communications', departmentId: 'CEA', created_by: 'superadmin-001' },
      
      // College of Engineering
      { id: 'BSEE', name: 'BS in Electrical Engineering', departmentId: 'CoE', created_by: 'superadmin-001' },
      { id: 'BSCE', name: 'BS in Civil Engineering', departmentId: 'CoE', created_by: 'superadmin-001' },
      { id: 'BSME', name: 'BS in Mechanical Engineering', departmentId: 'CoE', created_by: 'superadmin-001' },
      { id: 'BSIE', name: 'BS in Industrial Engineering', departmentId: 'CoE', created_by: 'superadmin-001' }
    ];

    for (const course of courses) {
      await connection.execute(
        `INSERT INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [course.id, course.name, course.departmentId, course.created_by, course.name]
      );
    }
    
    // 4. Create positions
    console.log('🏛️ Creating positions...');
    const positions = [
      { id: 'pos-001', name: 'President', voteLimit: 1, displayOrder: 1 },
      { id: 'pos-002', name: 'Vice President', voteLimit: 1, displayOrder: 2 },
      { id: 'pos-003', name: 'Secretary', voteLimit: 1, displayOrder: 3 },
      { id: 'pos-004', name: 'Assistant Secretary', voteLimit: 1, displayOrder: 4 },
      { id: 'pos-005', name: 'Treasurer', voteLimit: 1, displayOrder: 5 },
      { id: 'pos-006', name: 'Assistant Treasurer', voteLimit: 1, displayOrder: 6 },
      { id: 'pos-007', name: 'Auditor', voteLimit: 1, displayOrder: 7 },
      { id: 'pos-008', name: 'Assistant Auditor', voteLimit: 1, displayOrder: 8 },
      { id: 'pos-009', name: 'Public Relations Officer', voteLimit: 1, displayOrder: 9 },
      { id: 'pos-010', name: 'Assistant Public Relations Officer', voteLimit: 1, displayOrder: 10 },
      { id: 'pos-011', name: 'Business Manager', voteLimit: 1, displayOrder: 11 },
      { id: 'pos-012', name: 'Assistant Business Manager', voteLimit: 1, displayOrder: 12 },
      { id: 'pos-013', name: 'Board Member', voteLimit: 3, displayOrder: 13 },
      { id: 'pos-014', name: 'Senator', voteLimit: 5, displayOrder: 14 },
      { id: 'pos-015', name: 'Representative', voteLimit: 2, displayOrder: 15 }
    ];

    for (const position of positions) {
      await connection.execute(
        `INSERT INTO positions (id, name, voteLimit, displayOrder) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [position.id, position.name, position.voteLimit, position.displayOrder, position.name]
      );
    }
    
    // 5. Create one sample voter
    console.log('🗳️ Creating sample voter...');
    const sampleVoter = {
      name: 'Sample Student',
      email: 'sample.student@university.edu',
      studentId: '2024-001',
      departmentId: 'CCS',
      courseId: 'BSIT'
    };

    await connection.execute(
      `INSERT INTO voters (name, email, studentId, departmentId, courseId) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
      [sampleVoter.name, sampleVoter.email, sampleVoter.studentId, sampleVoter.departmentId, sampleVoter.courseId, sampleVoter.name]
    );
    
    console.log('\n✅ Database creation and seeding completed successfully!');
    console.log('\n📊 Your Voting System is now ready with:');
    console.log('   - Database: voting_system');
    console.log('   - All tables created with proper relationships');
    console.log('   - 1 Superadmin account (DevEagle)');
    console.log('   - 4 Colleges/Departments');
    console.log('   - 12 Courses');
    console.log('   - 15 Positions');
    console.log('   - 1 Sample Voter');
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Superadmin: DevEagle / devEagle123');
    
    console.log('\n🏢 Departments Created:');
    console.log('   - College of Business and Management (CBM)');
    console.log('   - College of Computer Studies (CCS)');
    console.log('   - College of Education and Arts (CEA)');
    console.log('   - College of Engineering (CoE)');
    
    console.log('\n📚 Courses Created:');
    console.log('   CBM: BSHM, BSA, BSBA-MM, BSBA-HRDM');
    console.log('   CCS: BSIT');
    console.log('   CEA: BEEd, BSEd-English, BMC');
    console.log('   CoE: BSEE, BSCE, BSME, BSIE');
    
    console.log('\n🌐 Next Steps:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. Start the frontend: cd ../frontend && npm run dev');
    console.log('   3. Access the application at http://localhost:5173');
    console.log('   4. Login as DevEagle to manage the system');
    
  } catch (error) {
    console.error('\n❌ Database creation failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check if MySQL is installed and started');
      console.log('   - Verify the database credentials');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check MySQL username and password');
      console.log('   - Update the dbConfig in this script');
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

// Run the database creation
createDatabase(); 