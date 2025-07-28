import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'voting_system'
};

async function getExistingTables(connection) {
  const [rows] = await connection.execute('SHOW TABLES');
  return rows.map(row => Object.values(row)[0]);
}

async function exportCurrentData() {
  let connection;
  
  try {
    console.log('📊 Exporting current database data...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Get existing tables
    const existingTables = await getExistingTables(connection);
    console.log('📋 Existing tables:', existingTables.join(', '));
    
    // Export data from each table
    const data = {};
    
    // Export superadmins (if table exists)
    if (existingTables.includes('superadmins')) {
      console.log('👑 Exporting superadmins...');
      const [superadmins] = await connection.execute('SELECT * FROM superadmins');
      data.superadmins = superadmins;
      console.log(`   Found ${superadmins.length} superadmin(s)`);
    } else {
      console.log('⚠️  superadmins table does not exist, skipping...');
      data.superadmins = [];
    }
    
    // Export admins
    if (existingTables.includes('admins')) {
      console.log('👨‍💼 Exporting admins...');
      const [admins] = await connection.execute('SELECT * FROM admins');
      data.admins = admins;
      console.log(`   Found ${admins.length} admin(s)`);
    } else {
      console.log('⚠️  admins table does not exist, skipping...');
      data.admins = [];
    }
    
    // Export departments
    if (existingTables.includes('departments')) {
      console.log('🏢 Exporting departments...');
      const [departments] = await connection.execute('SELECT * FROM departments');
      data.departments = departments;
      console.log(`   Found ${departments.length} department(s)`);
    } else {
      console.log('⚠️  departments table does not exist, skipping...');
      data.departments = [];
    }
    
    // Export courses
    if (existingTables.includes('courses')) {
      console.log('📚 Exporting courses...');
      const [courses] = await connection.execute('SELECT * FROM courses');
      data.courses = courses;
      console.log(`   Found ${courses.length} course(s)`);
    } else {
      console.log('⚠️  courses table does not exist, skipping...');
      data.courses = [];
    }
    
    // Export positions
    if (existingTables.includes('positions')) {
      console.log('🏛️ Exporting positions...');
      const [positions] = await connection.execute('SELECT * FROM positions');
      data.positions = positions;
      console.log(`   Found ${positions.length} position(s)`);
    } else {
      console.log('⚠️  positions table does not exist, skipping...');
      data.positions = [];
    }
    
    // Export candidates
    if (existingTables.includes('candidates')) {
      console.log('👥 Exporting candidates...');
      const [candidates] = await connection.execute('SELECT * FROM candidates');
      data.candidates = candidates;
      console.log(`   Found ${candidates.length} candidate(s)`);
    } else {
      console.log('⚠️  candidates table does not exist, skipping...');
      data.candidates = [];
    }
    
    // Export voters
    if (existingTables.includes('voters')) {
      console.log('🗳️ Exporting voters...');
      const [voters] = await connection.execute('SELECT * FROM voters');
      data.voters = voters;
      console.log(`   Found ${voters.length} voter(s)`);
    } else {
      console.log('⚠️  voters table does not exist, skipping...');
      data.voters = [];
    }
    
    // Export elections
    if (existingTables.includes('elections')) {
      console.log('🗳️ Exporting elections...');
      const [elections] = await connection.execute('SELECT * FROM elections');
      data.elections = elections;
      console.log(`   Found ${elections.length} election(s)`);
    } else {
      console.log('⚠️  elections table does not exist, skipping...');
      data.elections = [];
    }
    
    // Export election_positions
    if (existingTables.includes('election_positions')) {
      console.log('📋 Exporting election positions...');
      const [electionPositions] = await connection.execute('SELECT * FROM election_positions');
      data.election_positions = electionPositions;
      console.log(`   Found ${electionPositions.length} election position(s)`);
    } else {
      console.log('⚠️  election_positions table does not exist, skipping...');
      data.election_positions = [];
    }
    
    // Export election_candidates
    if (existingTables.includes('election_candidates')) {
      console.log('👥 Exporting election candidates...');
      const [electionCandidates] = await connection.execute('SELECT * FROM election_candidates');
      data.election_candidates = electionCandidates;
      console.log(`   Found ${electionCandidates.length} election candidate(s)`);
    } else {
      console.log('⚠️  election_candidates table does not exist, skipping...');
      data.election_candidates = [];
    }
    
    // Create the export file
    const exportPath = path.join(__dirname, 'current-data-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    
    console.log(`\n✅ Data exported successfully to: ${exportPath}`);
    console.log('\n📊 Summary:');
    console.log(`   Superadmins: ${data.superadmins.length}`);
    console.log(`   Admins: ${data.admins.length}`);
    console.log(`   Departments: ${data.departments.length}`);
    console.log(`   Courses: ${data.courses.length}`);
    console.log(`   Positions: ${data.positions.length}`);
    console.log(`   Candidates: ${data.candidates.length}`);
    console.log(`   Voters: ${data.voters.length}`);
    console.log(`   Elections: ${data.elections.length}`);
    console.log(`   Election Positions: ${data.election_positions.length}`);
    console.log(`   Election Candidates: ${data.election_candidates.length}`);
    
    // Create the new seed data file
    await createNewSeedData(data);
    
  } catch (error) {
    console.error('❌ Error exporting data:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your MySQL server is running and the database exists.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createNewSeedData(data) {
  console.log('\n🌱 Creating new seed data file...');
  
  const seedDataPath = path.join(__dirname, 'current-seed-data.js');
  
  const seedDataContent = `// Current Database Data as Default Seed Data
// Generated on: ${new Date().toISOString()}

export const currentSeedData = {
  superadmins: ${JSON.stringify(data.superadmins, null, 2)},
  
  admins: ${JSON.stringify(data.admins, null, 2)},
  
  departments: ${JSON.stringify(data.departments, null, 2)},
  
  courses: ${JSON.stringify(data.courses, null, 2)},
  
  positions: ${JSON.stringify(data.positions, null, 2)},
  
  candidates: ${JSON.stringify(data.candidates, null, 2)},
  
  voters: ${JSON.stringify(data.voters, null, 2)},
  
  elections: ${JSON.stringify(data.elections, null, 2)},
  
  election_positions: ${JSON.stringify(data.election_positions, null, 2)},
  
  election_candidates: ${JSON.stringify(data.election_candidates, null, 2)}
};

export async function seedWithCurrentData(connection) {
  console.log('🌱 Seeding database with current data...');
  
  try {
    // Insert superadmins
    if (currentSeedData.superadmins.length > 0) {
      console.log('👑 Inserting superadmins...');
      for (const superadmin of currentSeedData.superadmins) {
        await connection.execute(
          'INSERT IGNORE INTO superadmins (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
          [superadmin.id, superadmin.username, superadmin.email, superadmin.password, superadmin.created_at]
        );
      }
    }
    
    // Insert admins
    if (currentSeedData.admins.length > 0) {
      console.log('👨‍💼 Inserting admins...');
      for (const admin of currentSeedData.admins) {
        await connection.execute(
          'INSERT IGNORE INTO admins (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
          [admin.id, admin.username, admin.email, admin.password, admin.created_at]
        );
      }
    }
    
    // Insert departments
    if (currentSeedData.departments.length > 0) {
      console.log('🏢 Inserting departments...');
      for (const dept of currentSeedData.departments) {
        await connection.execute(
          'INSERT IGNORE INTO departments (id, name, created_at) VALUES (?, ?, ?)',
          [dept.id, dept.name, dept.created_at]
        );
      }
    }
    
    // Insert courses
    if (currentSeedData.courses.length > 0) {
      console.log('📚 Inserting courses...');
      for (const course of currentSeedData.courses) {
        await connection.execute(
          'INSERT IGNORE INTO courses (id, name, departmentId, created_at) VALUES (?, ?, ?, ?)',
          [course.id, course.name, course.departmentId, course.created_at]
        );
      }
    }
    
    // Insert positions
    if (currentSeedData.positions.length > 0) {
      console.log('🏛️ Inserting positions...');
      for (const position of currentSeedData.positions) {
        await connection.execute(
          'INSERT IGNORE INTO positions (id, title, description, created_at) VALUES (?, ?, ?, ?)',
          [position.id, position.title, position.description, position.created_at]
        );
      }
    }
    
    // Insert candidates
    if (currentSeedData.candidates.length > 0) {
      console.log('👥 Inserting candidates...');
      for (const candidate of currentSeedData.candidates) {
        await connection.execute(
          'INSERT IGNORE INTO candidates (id, name, positionId, created_at) VALUES (?, ?, ?, ?)',
          [candidate.id, candidate.name, candidate.positionId, candidate.created_at]
        );
      }
    }
    
    // Insert voters
    if (currentSeedData.voters.length > 0) {
      console.log('🗳️ Inserting voters...');
      for (const voter of currentSeedData.voters) {
        await connection.execute(
          'INSERT IGNORE INTO voters (id, name, email, studentId, hasVoted, departmentId, courseId, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [voter.id, voter.name, voter.email, voter.studentId, voter.hasVoted, voter.departmentId, voter.courseId, voter.created_at]
        );
      }
    }
    
    // Insert elections
    if (currentSeedData.elections.length > 0) {
      console.log('🗳️ Inserting elections...');
      for (const election of currentSeedData.elections) {
        await connection.execute(
          'INSERT IGNORE INTO elections (id, title, description, startDate, endDate, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [election.id, election.title, election.description, election.startDate, election.endDate, election.status, election.created_at]
        );
      }
    }
    
    // Insert election_positions
    if (currentSeedData.election_positions.length > 0) {
      console.log('📋 Inserting election positions...');
      for (const ep of currentSeedData.election_positions) {
        await connection.execute(
          'INSERT IGNORE INTO election_positions (id, electionId, positionId, created_at) VALUES (?, ?, ?, ?)',
          [ep.id, ep.electionId, ep.positionId, ep.created_at]
        );
      }
    }
    
    // Insert election_candidates
    if (currentSeedData.election_candidates.length > 0) {
      console.log('👥 Inserting election candidates...');
      for (const ec of currentSeedData.election_candidates) {
        await connection.execute(
          'INSERT IGNORE INTO election_candidates (id, electionId, candidateId, created_at) VALUES (?, ?, ?, ?)',
          [ec.id, ec.electionId, ec.candidateId, ec.created_at]
        );
      }
    }
    
    console.log('✅ Current data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding current data:', error);
    throw error;
  }
}
`;

  fs.writeFileSync(seedDataPath, seedDataContent);
  console.log(`✅ New seed data file created: ${seedDataPath}`);
  
  console.log('\n📝 Next steps:');
  console.log('1. Review the generated data in current-seed-data.js');
  console.log('2. Update database.js to use this new seed data');
  console.log('3. Test the new default data');
}

// Run the export
exportCurrentData(); 