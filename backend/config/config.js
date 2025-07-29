import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const config = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'voting_system',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    timezone: process.env.DB_TIMEZONE || '+00:00',
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Password Reset Configuration
  passwordReset: {
    tokenExpiry: parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY) || 3600000, // 1 hour
    baseUrl: process.env.PASSWORD_RESET_BASE_URL || 'http://localhost:5173'
  },

  // File Upload Configuration
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5242880, // 5MB
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif'],
    destination: process.env.UPLOAD_DESTINATION || 'uploads'
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-key-change-this-in-production'
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@votingsystem.com'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // API Configuration
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api'
  },

  // Frontend URL
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173'
  },

  // Production Configuration
  production: {
    dbHost: process.env.PRODUCTION_DB_HOST || '',
    dbUser: process.env.PRODUCTION_DB_USER || '',
    dbPassword: process.env.PRODUCTION_DB_PASSWORD || '',
    dbName: process.env.PRODUCTION_DB_NAME || 'voting_system_prod'
  },

  // SSL Configuration
  ssl: {
    keyPath: process.env.SSL_KEY_PATH || '',
    certPath: process.env.SSL_CERT_PATH || ''
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB) || 0
  },

  // Monitoring Configuration
  monitoring: {
    enabled: process.env.ENABLE_MONITORING === 'true',
    port: parseInt(process.env.MONITORING_PORT) || 3001
  },

  // Backup Configuration
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    path: process.env.BACKUP_PATH || './backups'
  }
};

// Helper functions
config.getDatabaseConfig = () => {
  if (config.server.isProduction) {
    return {
      ...config.database,
      host: config.production.dbHost,
      user: config.production.dbUser,
      password: config.production.dbPassword,
      database: config.production.dbName
    };
  }
  return config.database;
};

config.getApiUrl = (endpoint = '') => {
  return `${config.api.prefix}/${config.api.version}${endpoint}`;
};

config.isEmailConfigured = () => {
  return config.email.user && config.email.pass;
};

config.isSSLConfigured = () => {
  return config.ssl.keyPath && config.ssl.certPath;
};

config.isRedisConfigured = () => {
  return config.redis.host && config.redis.port;
};

export default config; 