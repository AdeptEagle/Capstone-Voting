import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "root",
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "voting_system",
  charset: 'utf8mb4',
  timezone: '+00:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

export async function createConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return await pool.getConnection();
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}