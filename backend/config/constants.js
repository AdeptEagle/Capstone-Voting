// Application constants
export const JWT_SECRET = "voting_system_secret_key_2024"; // Change this in production

// File upload constants
export const UPLOAD_LIMITS = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Election status constants
export const ELECTION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  ENDED: 'ended'
};

// User roles
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user'
};

// Default values
export const DEFAULTS = {
  VOTE_LIMIT: 1,
  JWT_EXPIRY: '8h'
}; 