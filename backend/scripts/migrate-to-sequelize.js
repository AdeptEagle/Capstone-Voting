import { sequelize, testConnection, syncDatabase } from '../config/sequelize.js';
import '../models/sequelize/index.js'; // Import all models to register them

async function migrateToSequelize() {
  try {
    console.log('🚀 Starting Sequelize migration...');
    
    // Test connection
    console.log('🔍 Testing database connection...');
    const connectionOk = await testConnection();
    if (!connectionOk) {
      throw new Error('Database connection failed');
    }
    console.log('✅ Database connection successful');
    
    // Sync database (create tables)
    console.log('🏗️ Creating/updating database tables...');
    const syncOk = await syncDatabase(false); // Don't force, preserve existing data
    if (!syncOk) {
      throw new Error('Database synchronization failed');
    }
    console.log('✅ Database tables synchronized');
    
    console.log('✅ Sequelize migration completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Update your controllers to use Sequelize models');
    console.log('2. Test the new models with your existing data');
    console.log('3. Gradually replace the old database.js usage');
    console.log('4. Remove the old models when everything is working');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run migration if this script is executed directly
migrateToSequelize();

export default migrateToSequelize; 