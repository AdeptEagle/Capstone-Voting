import mysql from 'mysql2/promise';
import { ensureDatabaseAndTables } from '../config/database.js';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 Setting up Voting System Database...\n');
    
    // Test basic MySQL connection first
    console.log('🔍 Testing MySQL connection...');
    connection = await mysql.createConnection({
      ...dbConfig,
      multipleStatements: true
    });
    console.log('✅ MySQL connection successful');
    
    // Run the complete database setup
    console.log('\n🏗️ Running database initialization...');
    await ensureDatabaseAndTables();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Your Voting System is now ready with:');
    console.log('   - Database: voting_system');
    console.log('   - All tables created');
    console.log('   - Default data loaded (your current data)');
    console.log('   - 4 Admins (including superadmin)');
    console.log('   - 13 Departments');
    console.log('   - 15 Courses');
    console.log('   - 15 Positions');
    console.log('   - 18 Candidates');
    console.log('   - 21 Voters');
    console.log('   - 21 Elections');
    console.log('   - 147 Election Positions');
    console.log('   - 367 Election Candidates');
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Superadmin: superadmin / password123');
    console.log('   Admin: admin1123 / password123');
    
    console.log('\n🌐 Next Steps:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. Start the frontend: cd ../frontend && npm run dev');
    console.log('   3. Access the application at http://localhost:5173');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check if MySQL is installed and started');
      console.log('   - Verify the database credentials in config/database.js');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check MySQL username and password');
      console.log('   - Update database.js with correct credentials');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Database does not exist');
      console.log('   - Run: mysql -u root -p -e "CREATE DATABASE voting_system;"');
    }
    
    console.log('\n🔧 Available troubleshooting commands:');
    console.log('   npm run troubleshoot  # Database connection diagnostics');
    console.log('   npm run fix-db        # Auto-fix common database issues');
    console.log('   npm run reset-db      # Reset database completely');
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase(); 