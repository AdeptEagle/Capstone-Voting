import bcrypt from 'bcryptjs';

export async function seedWithCleanData(db, verbose = true) {
  try {
    if (verbose) {
      console.log('🌱 Seeding database with permanent default data...');
    }

    // 1. Create superadmin - DevEagle
    if (verbose) {
      console.log('👑 Creating superadmin account...');
    }
    const superadminPassword = await bcrypt.hash('devEagle123', 10);
    await db.execute(
      `INSERT INTO admins (id, username, email, password, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?, password = ?`,
      ['superadmin-001', 'DevEagle', 'devEagle@votingsystem.com', superadminPassword, 'superadmin', 'superadmin', superadminPassword]
    );
    
    // 2. Create departments with specific IDs
    if (verbose) {
      console.log('🏢 Creating departments...');
    }
    const departments = [
      { id: 'CBM', name: 'College of Business and Management', created_by: 'superadmin-001' },
      { id: 'CCS', name: 'College of Computer Studies', created_by: 'superadmin-001' },
      { id: 'CEA', name: 'College of Education and Arts', created_by: 'superadmin-001' },
      { id: 'CoE', name: 'College of Engineering', created_by: 'superadmin-001' }
    ];

    for (const dept of departments) {
      await db.execute(
        `INSERT INTO departments (id, name, created_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [dept.id, dept.name, dept.created_by, dept.name]
      );
    }
    
    // 3. Create courses with specific IDs
    if (verbose) {
      console.log('📚 Creating courses...');
    }
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
      await db.execute(
        `INSERT INTO courses (id, name, departmentId, created_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [course.id, course.name, course.departmentId, course.created_by, course.name]
      );
    }
    
    // 4. Create positions
    if (verbose) {
      console.log('🏛️ Creating positions...');
    }
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
      await db.execute(
        `INSERT INTO positions (id, name, voteLimit, displayOrder) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
        [position.id, position.name, position.voteLimit, position.displayOrder, position.name]
      );
    }
    
    // 5. Create one sample voter
    if (verbose) {
      console.log('🗳️ Creating sample voter...');
    }
    const sampleVoter = {
      name: 'Sample Student',
      email: 'sample.student@university.edu',
      studentId: '2024-001',
      departmentId: 'CCS',
      courseId: 'BSIT'
    };

    await db.execute(
      `INSERT INTO voters (name, email, studentId, departmentId, courseId) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?`,
      [sampleVoter.name, sampleVoter.email, sampleVoter.studentId, sampleVoter.departmentId, sampleVoter.courseId, sampleVoter.name]
    );
    
    if (verbose) {
      console.log('✅ Database seeding completed successfully!');
      console.log('\n📊 Permanent Default Data:');
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
    }
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
} 