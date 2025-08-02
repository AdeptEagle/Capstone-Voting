import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment-based configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_TEST = NODE_ENV === 'test';

// Database configuration
const DB_NAME = IS_TEST ? "voting_system_test" : "voting_system";

const config = {
  development: {
    username: "root",
    password: "root",
    database: DB_NAME,
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    charset: 'utf8mb4',
    timezone: '+00:00',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false // Set to console.log for debugging
  },
  test: {
    username: "root",
    password: "root",
    database: DB_NAME,
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    charset: 'utf8mb4',
    timezone: '+00:00',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || DB_NAME,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    charset: 'utf8mb4',
    timezone: '+00:00',
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
};

const envConfig = config[NODE_ENV] || config.development;

// Create Sequelize instance
const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    host: envConfig.host,
    port: envConfig.port,
    dialect: envConfig.dialect,
    charset: envConfig.charset,
    timezone: envConfig.timezone,
    pool: envConfig.pool,
    logging: envConfig.logging,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    return false;
  }
}

// Sync database (create tables)
async function syncDatabase(force = false) {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully.');
    return true;
  } catch (error) {
    console.error('❌ Error synchronizing database:', error.message);
    return false;
  }
}

// Close database connection
async function closeConnection() {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed successfully.');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
}

export {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection,
  DB_NAME,
  IS_TEST,
  NODE_ENV
}; 