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
          UNIQUE KEY unique_vote (voterId, electionId, positionId)
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
    
    // 1. Create superadmin
    console.log('👑 Creating superadmin account...');
    const superadminPassword = await bcrypt.hash('superadmin123', 10);
    await connection.execute(
      `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?, password = ?`,
      ['superadmin-001', 'superadmin', 'superadmin@votingsystem.com', superadminPassword, 'superadmin', 'superadmin', superadminPassword]
    );
    
    // 2. Create additional admin accounts
    console.log('👨‍💼 Creating additional admin accounts...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const additionalAdmins = [
      { id: 'admin-001', username: 'admin1', email: 'admin1@votingsystem.com', password: adminPassword, role: 'admin' },
      { id: 'admin-002', username: 'admin2', email: 'admin2@votingsystem.com', password: adminPassword, role: 'admin' },
      { id: 'admin-003', username: 'admin3', email: 'admin3@votingsystem.com', password: adminPassword, role: 'admin' }
    ];

    for (const admin of additionalAdmins) {
      await connection.execute(
        `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?`,
        [admin.id, admin.username, admin.email, admin.password, admin.role, admin.role]
      );
    }
    
    // 3. Create departments
    console.log('🏢 Creating departments...');
    const departments = [
      { id: 'dept-001', name: 'Computer Science', created_by: 'superadmin-001' },
      { id: 'dept-002', name: 'Information Technology', created_by: 'superadmin-001' },
      { id: 'dept-003', name: 'Civil Engineering', created_by: 'superadmin-001' },
      { id: 'dept-004', name: 'Mechanical Engineering', created_by: 'superadmin-001' },
      { id: 'dept-005', name: 'Electrical Engineering', created_by: 'superadmin-001' },
      { id: 'dept-006', name: 'Business Administration', created_by: 'superadmin-001' },
      { id: 'dept-007', name: 'Accountancy', created_by: 'superadmin-001' },
      { id: 'dept-008', name: 'Marketing Management', created_by: 'superadmin-001' },
      { id: 'dept-009', name: 'Psychology', created_by: 'superadmin-001' },
      { id: 'dept-010', name: 'English Literature', created_by: 'superadmin-001' },
      { id: 'dept-011', name: 'Mathematics', created_by: 'superadmin-001' },
      { id: 'dept-012', name: 'Biology', created_by: 'superadmin-001' }
    ];

    for (const dept of departments) {
      await connection.execute(
        `INSERT INTO departments (id, name, created_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [dept.id, dept.name, dept.created_by, dept.name]
      );
    }
    
    // 4. Create courses
    console.log('📚 Creating courses...');
    const courses = [
      { id: 'course-001', name: 'BS Computer Science', departmentId: 'dept-001', created_by: 'superadmin-001' },
      { id: 'course-002', name: 'BS Information Technology', departmentId: 'dept-002', created_by: 'superadmin-001' },
      { id: 'course-003', name: 'BS Computer Engineering', departmentId: 'dept-001', created_by: 'superadmin-001' },
      { id: 'course-004', name: 'BS Civil Engineering', departmentId: 'dept-003', created_by: 'superadmin-001' },
      { id: 'course-005', name: 'BS Mechanical Engineering', departmentId: 'dept-004', created_by: 'superadmin-001' },
      { id: 'course-006', name: 'BS Electrical Engineering', departmentId: 'dept-005', created_by: 'superadmin-001' },
      { id: 'course-007', name: 'BS Industrial Engineering', departmentId: 'dept-004', created_by: 'superadmin-001' },
      { id: 'course-008', name: 'BS Business Administration', departmentId: 'dept-006', created_by: 'superadmin-001' },
      { id: 'course-009', name: 'BS Accountancy', departmentId: 'dept-007', created_by: 'superadmin-001' },
      { id: 'course-010', name: 'BS Marketing Management', departmentId: 'dept-008', created_by: 'superadmin-001' },
      { id: 'course-011', name: 'BS Entrepreneurship', departmentId: 'dept-006', created_by: 'superadmin-001' },
      { id: 'course-012', name: 'BS Psychology', departmentId: 'dept-009', created_by: 'superadmin-001' },
      { id: 'course-013', name: 'BA English Literature', departmentId: 'dept-010', created_by: 'superadmin-001' },
      { id: 'course-014', name: 'BS Mathematics', departmentId: 'dept-011', created_by: 'superadmin-001' },
      { id: 'course-015', name: 'BS Biology', departmentId: 'dept-012', created_by: 'superadmin-001' }
    ];

    for (const course of courses) {
      await connection.execute(
        `INSERT INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [course.id, course.name, course.departmentId, course.created_by, course.name]
      );
    }
    
    // 5. Create positions
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
    
    // 6. Create candidates
    console.log('👥 Creating candidates...');
    const candidates = [
      // President candidates
      { id: 'cand-001', name: 'John Smith', positionId: 'pos-001', departmentId: 'dept-001', courseId: 'course-001', description: 'Experienced leader with strong vision', displayOrder: 1 },
      { id: 'cand-002', name: 'Maria Garcia', positionId: 'pos-001', departmentId: 'dept-006', courseId: 'course-008', description: 'Dedicated to student welfare', displayOrder: 2 },
      { id: 'cand-003', name: 'David Chen', positionId: 'pos-001', departmentId: 'dept-003', courseId: 'course-004', description: 'Innovative problem solver', displayOrder: 3 },
      
      // Vice President candidates
      { id: 'cand-004', name: 'Sarah Johnson', positionId: 'pos-002', departmentId: 'dept-002', courseId: 'course-002', description: 'Excellent communication skills', displayOrder: 1 },
      { id: 'cand-005', name: 'Michael Brown', positionId: 'pos-002', departmentId: 'dept-005', courseId: 'course-006', description: 'Strong organizational abilities', displayOrder: 2 },
      
      // Secretary candidates
      { id: 'cand-006', name: 'Emily Davis', positionId: 'pos-003', departmentId: 'dept-007', courseId: 'course-009', description: 'Detail-oriented and efficient', displayOrder: 1 },
      { id: 'cand-007', name: 'James Wilson', positionId: 'pos-003', departmentId: 'dept-001', courseId: 'course-003', description: 'Excellent record keeping', displayOrder: 2 },
      
      // Treasurer candidates
      { id: 'cand-008', name: 'Lisa Anderson', positionId: 'pos-005', departmentId: 'dept-007', courseId: 'course-009', description: 'Financial management expert', displayOrder: 1 },
      { id: 'cand-009', name: 'Robert Taylor', positionId: 'pos-005', departmentId: 'dept-006', courseId: 'course-008', description: 'Transparent financial handling', displayOrder: 2 },
      
      // Auditor candidates
      { id: 'cand-010', name: 'Jennifer Lee', positionId: 'pos-007', departmentId: 'dept-007', courseId: 'course-009', description: 'Strong analytical skills', displayOrder: 1 },
      { id: 'cand-011', name: 'Christopher Martinez', positionId: 'pos-007', departmentId: 'dept-006', courseId: 'course-008', description: 'Thorough and fair auditor', displayOrder: 2 },
      
      // PRO candidates
      { id: 'cand-012', name: 'Amanda White', positionId: 'pos-009', departmentId: 'dept-008', courseId: 'course-010', description: 'Excellent public speaking', displayOrder: 1 },
      { id: 'cand-013', name: 'Daniel Rodriguez', positionId: 'pos-009', departmentId: 'dept-010', courseId: 'course-013', description: 'Creative communication strategies', displayOrder: 2 },
      
      // Business Manager candidates
      { id: 'cand-014', name: 'Nicole Thompson', positionId: 'pos-011', departmentId: 'dept-006', courseId: 'course-008', description: 'Strategic business planning', displayOrder: 1 },
      { id: 'cand-015', name: 'Kevin Lewis', positionId: 'pos-011', departmentId: 'dept-006', courseId: 'course-011', description: 'Innovative business solutions', displayOrder: 2 },
      
      // Board Member candidates
      { id: 'cand-016', name: 'Rachel Green', positionId: 'pos-013', departmentId: 'dept-009', courseId: 'course-012', description: 'Student advocate', displayOrder: 1 },
      { id: 'cand-017', name: 'Thomas Clark', positionId: 'pos-013', departmentId: 'dept-011', courseId: 'course-014', description: 'Logical decision maker', displayOrder: 2 },
      { id: 'cand-018', name: 'Michelle Hall', positionId: 'pos-013', departmentId: 'dept-012', courseId: 'course-015', description: 'Diverse perspective', displayOrder: 3 }
    ];

    for (const candidate of candidates) {
      await connection.execute(
        `INSERT INTO candidates (id, name, positionId, departmentId, courseId, description, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [candidate.id, candidate.name, candidate.positionId, candidate.departmentId, candidate.courseId, candidate.description, candidate.displayOrder, candidate.name]
      );
    }
    
    // 7. Create voters
    console.log('🗳️ Creating voters...');
    const voters = [
      { name: 'Alice Johnson', email: 'alice.johnson@student.edu', studentId: '2021-001', departmentId: 'dept-001', courseId: 'course-001' },
      { name: 'Bob Smith', email: 'bob.smith@student.edu', studentId: '2021-002', departmentId: 'dept-002', courseId: 'course-002' },
      { name: 'Carol Davis', email: 'carol.davis@student.edu', studentId: '2021-003', departmentId: 'dept-003', courseId: 'course-004' },
      { name: 'David Wilson', email: 'david.wilson@student.edu', studentId: '2021-004', departmentId: 'dept-004', courseId: 'course-005' },
      { name: 'Eva Brown', email: 'eva.brown@student.edu', studentId: '2021-005', departmentId: 'dept-005', courseId: 'course-006' },
      { name: 'Frank Miller', email: 'frank.miller@student.edu', studentId: '2021-006', departmentId: 'dept-006', courseId: 'course-008' },
      { name: 'Grace Taylor', email: 'grace.taylor@student.edu', studentId: '2021-007', departmentId: 'dept-007', courseId: 'course-009' },
      { name: 'Henry Anderson', email: 'henry.anderson@student.edu', studentId: '2021-008', departmentId: 'dept-008', courseId: 'course-010' },
      { name: 'Ivy Martinez', email: 'ivy.martinez@student.edu', studentId: '2021-009', departmentId: 'dept-009', courseId: 'course-012' },
      { name: 'Jack Thompson', email: 'jack.thompson@student.edu', studentId: '2021-010', departmentId: 'dept-010', courseId: 'course-013' },
      { name: 'Kate Lewis', email: 'kate.lewis@student.edu', studentId: '2021-011', departmentId: 'dept-011', courseId: 'course-014' },
      { name: 'Liam Clark', email: 'liam.clark@student.edu', studentId: '2021-012', departmentId: 'dept-012', courseId: 'course-015' },
      { name: 'Maya Hall', email: 'maya.hall@student.edu', studentId: '2021-013', departmentId: 'dept-001', courseId: 'course-003' },
      { name: 'Noah White', email: 'noah.white@student.edu', studentId: '2021-014', departmentId: 'dept-004', courseId: 'course-007' },
      { name: 'Olivia Green', email: 'olivia.green@student.edu', studentId: '2021-015', departmentId: 'dept-006', courseId: 'course-011' },
      { name: 'Paul Rodriguez', email: 'paul.rodriguez@student.edu', studentId: '2021-016', departmentId: 'dept-002', courseId: 'course-002' },
      { name: 'Quinn Lee', email: 'quinn.lee@student.edu', studentId: '2021-017', departmentId: 'dept-003', courseId: 'course-004' },
      { name: 'Ruby Chen', email: 'ruby.chen@student.edu', studentId: '2021-018', departmentId: 'dept-005', courseId: 'course-006' },
      { name: 'Sam Garcia', email: 'sam.garcia@student.edu', studentId: '2021-019', departmentId: 'dept-007', courseId: 'course-009' },
      { name: 'Tina Moore', email: 'tina.moore@student.edu', studentId: '2021-020', departmentId: 'dept-008', courseId: 'course-010' },
      { name: 'Ulysses Park', email: 'ulysses.park@student.edu', studentId: '2021-021', departmentId: 'dept-009', courseId: 'course-012' }
    ];

    for (const voter of voters) {
      await connection.execute(
        `INSERT INTO voters (name, email, studentId, departmentId, courseId) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [voter.name, voter.email, voter.studentId, voter.departmentId, voter.courseId, voter.name]
      );
    }
    
    // 8. Create sample elections
    console.log('🗳️ Creating sample elections...');
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
    
    const elections = [
      { id: 'ELEC-2024-001', title: 'Student Council Election 2024', description: 'Annual student council election for the academic year 2024-2025', startTime, endTime, status: 'pending', created_by: 'superadmin-001' },
      { id: 'ELEC-2024-002', title: 'Department Representatives Election', description: 'Election for department representatives', startTime, endTime, status: 'pending', created_by: 'superadmin-001' }
    ];

    for (const election of elections) {
      await connection.execute(
        `INSERT INTO elections (id, title, description, startTime, endTime, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?`,
        [election.id, election.title, election.description, election.startTime, election.endTime, election.status, election.created_by, election.title]
      );
    }
    
    console.log('\n✅ Database creation and seeding completed successfully!');
    console.log('\n📊 Your Voting System is now ready with:');
    console.log('   - Database: voting_system');
    console.log('   - All tables created with proper relationships');
    console.log('   - 4 Admin accounts (1 superadmin, 3 admins)');
    console.log('   - 12 Departments');
    console.log('   - 15 Courses');
    console.log('   - 15 Positions');
    console.log('   - 18 Candidates');
    console.log('   - 21 Voters');
    console.log('   - 2 Sample Elections');
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Superadmin: superadmin / superadmin123');
    console.log('   Admin: admin1 / admin123');
    
    console.log('\n🌐 Next Steps:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. Start the frontend: cd ../frontend && npm run dev');
    console.log('   3. Access the application at http://localhost:5173');
    
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