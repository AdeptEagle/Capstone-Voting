#!/usr/bin/env node

import { createConnection, runQuery } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

console.log('🌱 Seeding database with default data...');

async function seedDatabase() {
  const db = createConnection();
  
  try {
    console.log('📊 Starting database seeding...');

    // 1. Create default superadmin
    console.log('👑 Creating default superadmin...');
    const superadminPassword = await bcrypt.hash('superadmin123', 10);
    await runQuery(db, `INSERT IGNORE INTO admins (id, username, email, password, role) VALUES (
      'superadmin-001', 'superadmin', 'superadmin@votingsystem.com', ?, 'superadmin'
    )`, [superadminPassword]);

    // 2. Create additional admin accounts
    console.log('👨‍💼 Creating additional admin accounts...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const additionalAdmins = [
      { id: 'admin-001', username: 'admin1', email: 'admin1@votingsystem.com', password: adminPassword, role: 'admin' },
      { id: 'admin-002', username: 'admin2', email: 'admin2@votingsystem.com', password: adminPassword, role: 'admin' },
      { id: 'admin-003', username: 'admin3', email: 'admin3@votingsystem.com', password: adminPassword, role: 'admin' }
    ];

    for (const admin of additionalAdmins) {
      await runQuery(db, `INSERT IGNORE INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)`, 
        [admin.id, admin.username, admin.email, admin.password, admin.role]);
    }

    // 3. Create comprehensive departments
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
      await runQuery(db, `INSERT IGNORE INTO departments (id, name, created_by) VALUES (?, ?, ?)`, 
        [dept.id, dept.name, dept.created_by]);
    }

    // 4. Create comprehensive courses
    console.log('📚 Creating courses...');
    const courses = [
      // Computer Science & IT
      { id: 'course-001', name: 'BS Computer Science', departmentId: 'dept-001', created_by: 'superadmin-001' },
      { id: 'course-002', name: 'BS Information Technology', departmentId: 'dept-002', created_by: 'superadmin-001' },
      { id: 'course-003', name: 'BS Computer Engineering', departmentId: 'dept-001', created_by: 'superadmin-001' },
      
      // Engineering
      { id: 'course-004', name: 'BS Civil Engineering', departmentId: 'dept-003', created_by: 'superadmin-001' },
      { id: 'course-005', name: 'BS Mechanical Engineering', departmentId: 'dept-004', created_by: 'superadmin-001' },
      { id: 'course-006', name: 'BS Electrical Engineering', departmentId: 'dept-005', created_by: 'superadmin-001' },
      { id: 'course-007', name: 'BS Industrial Engineering', departmentId: 'dept-004', created_by: 'superadmin-001' },
      
      // Business
      { id: 'course-008', name: 'BS Business Administration', departmentId: 'dept-006', created_by: 'superadmin-001' },
      { id: 'course-009', name: 'BS Accountancy', departmentId: 'dept-007', created_by: 'superadmin-001' },
      { id: 'course-010', name: 'BS Marketing Management', departmentId: 'dept-008', created_by: 'superadmin-001' },
      { id: 'course-011', name: 'BS Entrepreneurship', departmentId: 'dept-006', created_by: 'superadmin-001' },
      
      // Arts & Sciences
      { id: 'course-012', name: 'BS Psychology', departmentId: 'dept-009', created_by: 'superadmin-001' },
      { id: 'course-013', name: 'BA English Literature', departmentId: 'dept-010', created_by: 'superadmin-001' },
      { id: 'course-014', name: 'BS Mathematics', departmentId: 'dept-011', created_by: 'superadmin-001' },
      { id: 'course-015', name: 'BS Biology', departmentId: 'dept-012', created_by: 'superadmin-001' }
    ];

    for (const course of courses) {
      await runQuery(db, `INSERT IGNORE INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?)`, 
        [course.id, course.name, course.departmentId, course.created_by]);
    }

    // 5. Create comprehensive positions
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
      { id: 'pos-013', name: 'Sergeant-at-Arms', voteLimit: 1, displayOrder: 13 },
      { id: 'pos-014', name: 'Assistant Sergeant-at-Arms', voteLimit: 1, displayOrder: 14 },
      { id: 'pos-015', name: 'Board Member', voteLimit: 3, displayOrder: 15 }
    ];

    for (const pos of positions) {
      await runQuery(db, `INSERT IGNORE INTO positions (id, name, voteLimit, displayOrder) VALUES (?, ?, ?, ?)`, 
        [pos.id, pos.name, pos.voteLimit, pos.displayOrder]);
    }

    // 6. Create sample candidates
    console.log('👥 Creating sample candidates...');
    const candidates = [
      // President candidates
      { id: 'cand-001', name: 'John Michael Santos', positionId: 'pos-001', departmentId: 'dept-001', courseId: 'course-001', description: 'Experienced leader with strong communication skills. Committed to transparency and student welfare.' },
      { id: 'cand-002', name: 'Maria Isabella Cruz', positionId: 'pos-001', departmentId: 'dept-006', courseId: 'course-008', description: 'Innovative thinker with excellent organizational skills. Focused on academic excellence and student development.' },
      { id: 'cand-003', name: 'Carlos Antonio Reyes', positionId: 'pos-001', departmentId: 'dept-003', courseId: 'course-004', description: 'Dedicated student leader with proven track record. Committed to building a stronger student community.' },
      
      // Vice President candidates
      { id: 'cand-004', name: 'Ana Sofia Mendoza', positionId: 'pos-002', departmentId: 'dept-002', courseId: 'course-002', description: 'Team player with excellent coordination skills. Passionate about student representation.' },
      { id: 'cand-005', name: 'Luis Miguel Torres', positionId: 'pos-002', departmentId: 'dept-004', courseId: 'course-005', description: 'Dynamic leader with strong problem-solving abilities. Committed to student advocacy.' },
      
      // Secretary candidates
      { id: 'cand-006', name: 'Gabriela Nicole Fernandez', positionId: 'pos-003', departmentId: 'dept-007', courseId: 'course-009', description: 'Detail-oriented with excellent documentation skills. Committed to maintaining accurate records.' },
      { id: 'cand-007', name: 'Roberto Carlos Lopez', positionId: 'pos-003', departmentId: 'dept-010', courseId: 'course-013', description: 'Strong communication skills with attention to detail. Dedicated to efficient record-keeping.' },
      
      // Treasurer candidates
      { id: 'cand-008', name: 'Isabella Grace Santos', positionId: 'pos-005', departmentId: 'dept-007', courseId: 'course-009', description: 'Financial management expert with strong analytical skills. Committed to transparent financial reporting.' },
      { id: 'cand-009', name: 'Diego Alejandro Martinez', positionId: 'pos-005', departmentId: 'dept-006', courseId: 'course-008', description: 'Experienced in budget planning and financial oversight. Dedicated to fiscal responsibility.' },
      
      // Auditor candidates
      { id: 'cand-010', name: 'Valentina Sofia Ramirez', positionId: 'pos-007', departmentId: 'dept-007', courseId: 'course-009', description: 'Strong analytical skills with attention to detail. Committed to ensuring financial accountability.' },
      { id: 'cand-011', name: 'Santiago Jose Gonzalez', positionId: 'pos-007', departmentId: 'dept-011', courseId: 'course-014', description: 'Mathematical precision with auditing expertise. Dedicated to maintaining financial integrity.' },
      
      // PRO candidates
      { id: 'cand-012', name: 'Camila Elena Rodriguez', positionId: 'pos-009', departmentId: 'dept-008', courseId: 'course-010', description: 'Excellent communication skills with creative marketing ideas. Committed to enhancing student engagement.' },
      { id: 'cand-013', name: 'Andres Felipe Herrera', positionId: 'pos-009', departmentId: 'dept-009', courseId: 'course-012', description: 'Strong interpersonal skills with media experience. Dedicated to effective student communication.' },
      
      // Board Member candidates
      { id: 'cand-014', name: 'Sofia Alejandra Morales', positionId: 'pos-015', departmentId: 'dept-001', courseId: 'course-001', description: 'Tech-savvy leader with innovative ideas for student services.' },
      { id: 'cand-015', name: 'Javier Enrique Silva', positionId: 'pos-015', departmentId: 'dept-003', courseId: 'course-004', description: 'Engineering student with strong problem-solving skills and community focus.' },
      { id: 'cand-016', name: 'Daniela Patricia Castro', positionId: 'pos-015', departmentId: 'dept-006', courseId: 'course-008', description: 'Business student with leadership experience and strategic thinking abilities.' },
      { id: 'cand-017', name: 'Ricardo Manuel Vargas', positionId: 'pos-015', departmentId: 'dept-012', courseId: 'course-015', description: 'Science student with research background and analytical approach to student issues.' },
      { id: 'cand-018', name: 'Natalia Sofia Jimenez', positionId: 'pos-015', departmentId: 'dept-010', courseId: 'course-013', description: 'Literature student with strong communication skills and cultural awareness.' }
    ];

    for (const candidate of candidates) {
      await runQuery(db, `INSERT IGNORE INTO candidates (id, name, positionId, departmentId, courseId, description) VALUES (?, ?, ?, ?, ?, ?)`, 
        [candidate.id, candidate.name, candidate.positionId, candidate.departmentId, candidate.courseId, candidate.description]);
    }

    // 7. Create sample voters
    console.log('🗳️ Creating sample voters...');
    const voterPassword = await bcrypt.hash('voter123', 10);
    const voters = [
      // Computer Science & IT Voters
      { name: 'Alexandra Marie Santos', email: 'alexandra.santos@student.edu', studentId: '2024-CS-0001', departmentId: 'dept-001', courseId: 'course-001' },
      { name: 'Miguel Angel Cruz', email: 'miguel.cruz@student.edu', studentId: '2024-CS-0002', departmentId: 'dept-001', courseId: 'course-001' },
      { name: 'Isabella Grace Reyes', email: 'isabella.reyes@student.edu', studentId: '2024-CS-0003', departmentId: 'dept-001', courseId: 'course-001' },
      { name: 'Carlos Eduardo Mendoza', email: 'carlos.mendoza@student.edu', studentId: '2024-IT-0001', departmentId: 'dept-002', courseId: 'course-002' },
      { name: 'Sofia Alejandra Torres', email: 'sofia.torres@student.edu', studentId: '2024-IT-0002', departmentId: 'dept-002', courseId: 'course-002' },
      
      // Engineering Voters
      { name: 'Luis Fernando Fernandez', email: 'luis.fernandez@student.edu', studentId: '2024-CE-0001', departmentId: 'dept-003', courseId: 'course-004' },
      { name: 'Ana Gabriela Lopez', email: 'ana.lopez@student.edu', studentId: '2024-CE-0002', departmentId: 'dept-003', courseId: 'course-004' },
      { name: 'Roberto Carlos Silva', email: 'roberto.silva@student.edu', studentId: '2024-ME-0001', departmentId: 'dept-004', courseId: 'course-005' },
      { name: 'Maria Elena Castro', email: 'maria.castro@student.edu', studentId: '2024-ME-0002', departmentId: 'dept-004', courseId: 'course-005' },
      { name: 'Diego Alejandro Vargas', email: 'diego.vargas@student.edu', studentId: '2024-EE-0001', departmentId: 'dept-005', courseId: 'course-006' },
      
      // Business Voters
      { name: 'Valentina Sofia Jimenez', email: 'valentina.jimenez@student.edu', studentId: '2024-BA-0001', departmentId: 'dept-006', courseId: 'course-008' },
      { name: 'Santiago Jose Morales', email: 'santiago.morales@student.edu', studentId: '2024-BA-0002', departmentId: 'dept-006', courseId: 'course-008' },
      { name: 'Camila Elena Rodriguez', email: 'camila.rodriguez@student.edu', studentId: '2024-AC-0001', departmentId: 'dept-007', courseId: 'course-009' },
      { name: 'Andres Felipe Herrera', email: 'andres.herrera@student.edu', studentId: '2024-AC-0002', departmentId: 'dept-007', courseId: 'course-009' },
      { name: 'Natalia Sofia Gonzalez', email: 'natalia.gonzalez@student.edu', studentId: '2024-MM-0001', departmentId: 'dept-008', courseId: 'course-010' },
      
      // Arts & Sciences Voters
      { name: 'Ricardo Manuel Ramirez', email: 'ricardo.ramirez@student.edu', studentId: '2024-PS-0001', departmentId: 'dept-009', courseId: 'course-012' },
      { name: 'Daniela Patricia Martinez', email: 'daniela.martinez@student.edu', studentId: '2024-EL-0001', departmentId: 'dept-010', courseId: 'course-013' },
      { name: 'Javier Enrique Santos', email: 'javier.santos@student.edu', studentId: '2024-MA-0001', departmentId: 'dept-011', courseId: 'course-014' },
      { name: 'Sofia Alejandra Cruz', email: 'sofia.cruz@student.edu', studentId: '2024-BI-0001', departmentId: 'dept-012', courseId: 'course-015' }
    ];

    for (const voter of voters) {
      await runQuery(db, `INSERT IGNORE INTO voters (name, email, studentId, password, departmentId, courseId) VALUES (?, ?, ?, ?, ?, ?)`, 
        [voter.name, voter.email, voter.studentId, voterPassword, voter.departmentId, voter.courseId]);
    }

    // 8. Create sample election
    console.log('🗳️ Creating sample election...');
    const electionId = uuidv4();
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
    
    await runQuery(db, `INSERT IGNORE INTO elections (id, title, description, startTime, endTime, status, created_by) VALUES (?, ?, ?, ?, ?, 'pending', ?)`, 
      [electionId, 'Student Council Election 2024', 'Annual election for the Student Council Executive Board. All registered students are eligible to vote.', startTime, endTime, 'superadmin-001']);

    // 9. Assign positions to election
    console.log('📋 Assigning positions to election...');
    const electionPositions = [
      { id: uuidv4(), electionId, positionId: 'pos-001' }, // President
      { id: uuidv4(), electionId, positionId: 'pos-002' }, // Vice President
      { id: uuidv4(), electionId, positionId: 'pos-003' }, // Secretary
      { id: uuidv4(), electionId, positionId: 'pos-005' }, // Treasurer
      { id: uuidv4(), electionId, positionId: 'pos-007' }, // Auditor
      { id: uuidv4(), electionId, positionId: 'pos-009' }, // PRO
      { id: uuidv4(), electionId, positionId: 'pos-015' }  // Board Members
    ];

    for (const ep of electionPositions) {
      await runQuery(db, `INSERT IGNORE INTO election_positions (id, electionId, positionId) VALUES (?, ?, ?)`, 
        [ep.id, ep.electionId, ep.positionId]);
    }

    // 10. Assign candidates to election
    console.log('👥 Assigning candidates to election...');
    const electionCandidates = candidates.map(candidate => ({
      id: uuidv4(),
      electionId,
      candidateId: candidate.id
    }));

    for (const ec of electionCandidates) {
      await runQuery(db, `INSERT IGNORE INTO election_candidates (id, electionId, candidateId) VALUES (?, ?, ?)`, 
        [ec.id, ec.electionId, ec.candidateId]);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary of seeded data:');
    console.log(`   👑 Admins: ${additionalAdmins.length + 1} (including superadmin)`);
    console.log(`   🏢 Departments: ${departments.length}`);
    console.log(`   📚 Courses: ${courses.length}`);
    console.log(`   🏛️ Positions: ${positions.length}`);
    console.log(`   👥 Candidates: ${candidates.length}`);
    console.log(`   🗳️ Voters: ${voters.length}`);
    console.log(`   🗳️ Elections: 1 (pending)`);
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   SuperAdmin: superadmin / superadmin123');
    console.log('   Admin: admin1 / admin123');
    console.log('   Voter: Any voter email / voter123');
    
    console.log('\n📝 Note: The sample election is set to start tomorrow and run for 7 days.');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    db.end();
  }
}

// Export the function for use in database.js
export { seedDatabase };

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
} 