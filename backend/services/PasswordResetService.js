import { createConnection } from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { VoterModel } from '../models/VoterModel.js';
import { AdminModel } from '../models/AdminModel.js';
import EmailService from './EmailService.js';

class PasswordResetService {
  static async generateResetToken(email, userType) {
    let db;
    
    try {
      console.log(`🔐 Password reset requested for: ${email} (${userType})`);
      
      // Create database connection
      db = createConnection();
      console.log('✅ Database connection established');
      
      // Check if user exists
      let user;
      if (userType === 'voter') {
        user = await VoterModel.getByEmail(email);
        console.log(`🔍 Voter lookup result: ${user ? 'Found' : 'Not found'}`);
      } else if (userType === 'admin') {
        user = await AdminModel.getByEmail(email);
        console.log(`🔍 Admin lookup result: ${user ? 'Found' : 'Not found'}`);
      }
      
      if (!user) {
        console.log(`❌ User not found: ${email}`);
        throw new Error('User not found');
      }
      
      console.log(`✅ User found: ${user.name || user.username}`);
      
      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      // Format expires_at for MySQL (UTC)
      const expiresAtUTC = expiresAt.toISOString().slice(0, 19).replace('T', ' ');
      
      console.log(`🔑 Generated token: ${token.substring(0, 8)}...`);
      console.log(`⏰ Token expires at: ${expiresAtUTC}`);
      
      // Store token in database
      const resetToken = {
        id: crypto.randomUUID(),
        email: email,
        token: token,
        user_type: userType,
        expires_at: expiresAtUTC
      };
      
      console.log('💾 Storing token in database...');
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO password_reset_tokens (id, email, token, user_type, expires_at) VALUES (?, ?, ?, ?, ?)',
          [resetToken.id, resetToken.email, resetToken.token, resetToken.user_type, resetToken.expires_at],
          (err, result) => {
            if (err) {
              console.error('❌ Database error storing token:', err);
              reject(err);
            } else {
              console.log('✅ Token stored successfully');
              resolve(result);
            }
          }
        );
      });
      
      // Send password reset email
      const userName = user.name || user.username;
      console.log('📧 Sending password reset email...');
      const emailResult = await EmailService.sendPasswordResetEmail(email, token, userType, userName);
      
      console.log('✅ Password reset email sent successfully');
      
      return { 
        success: true, 
        message: 'Password reset email sent successfully',
        previewUrl: null // No preview URL for Gmail
      };
      
    } catch (error) {
      console.error('❌ Password reset error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('ER_NO_SUCH_TABLE')) {
        throw new Error('Password reset table not found. Please contact administrator.');
      } else if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Database connection failed. Please try again later.');
      } else if (error.message.includes('Gmail authentication failed')) {
        throw new Error('Email service configuration error. Please contact administrator.');
      } else if (error.message.includes('Gmail connection failed')) {
        throw new Error('Email service temporarily unavailable. Please try again later.');
      } else if (error.message.includes('Failed to send password reset email')) {
        throw new Error('Email service unavailable. Please contact administrator.');
      } else {
        throw error;
      }
    } finally {
      if (db) {
        try {
          db.end();
          console.log('🔌 Database connection closed');
        } catch (closeError) {
          console.error('❌ Error closing database connection:', closeError);
        }
      }
    }
  }
  
  static async verifyResetToken(token) {
    let db;
    
    try {
      console.log(`🔍 Verifying token: ${token.substring(0, 8)}...`);
      
      db = createConnection();
      
      const result = await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > UTC_TIMESTAMP()',
          [token],
          (err, results) => {
            if (err) {
              console.error('❌ Database error verifying token:', err);
              reject(err);
            } else {
              console.log(`✅ Token verification result: ${results.length} records found`);
              resolve(results);
            }
          }
        );
      });
      
      if (result.length === 0) {
        console.log('❌ Token invalid or expired');
        throw new Error('Invalid or expired token');
      }
      
      console.log('✅ Token verified successfully');
      return result[0];
      
    } catch (error) {
      console.error('❌ Token verification error:', error);
      throw error;
    } finally {
      if (db) {
        try {
          db.end();
        } catch (closeError) {
          console.error('❌ Error closing database connection:', closeError);
        }
      }
    }
  }
  
  static async resetPassword(token, newPassword) {
    let db;
    
    try {
      console.log('🔄 Processing password reset...');
      
      // Verify token
      const resetToken = await this.verifyResetToken(token);
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log('🔐 Password hashed successfully');
      
      // Find user by email and update password
      let user = await VoterModel.getByEmail(resetToken.email);
      if (user) {
        console.log('👤 Updating voter password...');
        await VoterModel.updatePassword(user.id, hashedPassword);
        console.log('✅ Voter password updated');
      } else {
        user = await AdminModel.getByEmail(resetToken.email);
        if (user) {
          console.log('👤 Updating admin password...');
          await AdminModel.updatePassword(user.id, hashedPassword);
          console.log('✅ Admin password updated');
        } else {
          console.log('❌ User not found for password update');
          throw new Error('User not found');
        }
      }
      
      // Delete the used token
      db = createConnection();
      await new Promise((resolve, reject) => {
        db.query(
          'DELETE FROM password_reset_tokens WHERE token = ?',
          [token],
          (err, result) => {
            if (err) {
              console.error('❌ Error deleting used token:', err);
              reject(err);
            } else {
              console.log('✅ Used token deleted');
              resolve(result);
            }
          }
        );
      });
      
      console.log('✅ Password reset completed successfully');
      return { success: true, message: 'Password reset successfully' };
      
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    } finally {
      if (db) {
        try {
          db.end();
        } catch (closeError) {
          console.error('❌ Error closing database connection:', closeError);
        }
      }
    }
  }
  
  static async cleanupExpiredTokens() {
    let db;
    
    try {
      console.log('🧹 Cleaning up expired password reset tokens...');
      
      db = createConnection();
      await new Promise((resolve, reject) => {
        db.query(
          'DELETE FROM password_reset_tokens WHERE expires_at < NOW()',
          (err, result) => {
            if (err) {
              console.error('❌ Error cleaning up tokens:', err);
              reject(err);
            } else {
              console.log(`✅ Cleaned up ${result.affectedRows} expired tokens`);
              resolve(result);
            }
          }
        );
      });
      
      console.log('🧹 Cleaned up expired password reset tokens');
      
    } catch (error) {
      console.error('❌ Error cleaning up tokens:', error);
    } finally {
      if (db) {
        try {
          db.end();
        } catch (closeError) {
          console.error('❌ Error closing database connection:', closeError);
        }
      }
    }
  }

  static async ensurePasswordResetTable() {
    let db;
    
    try {
      console.log('🔍 Verifying password_reset_tokens table...');
      
      db = createConnection();
      
      // Check if table exists
      const tableExists = await new Promise((resolve, reject) => {
        db.query(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = DATABASE() AND table_name = 'password_reset_tokens'`,
          (err, results) => {
            if (err) {
              console.error('❌ Error checking table existence:', err);
              reject(err);
            } else {
              resolve(results[0].count > 0);
            }
          }
        );
      });
      
      if (!tableExists) {
        console.log('📋 Creating password_reset_tokens table...');
        
        await new Promise((resolve, reject) => {
          db.query(`
            CREATE TABLE password_reset_tokens (
              id VARCHAR(36) PRIMARY KEY,
              email VARCHAR(255) NOT NULL,
              token VARCHAR(255) NOT NULL UNIQUE,
              user_type ENUM('admin', 'voter') NOT NULL,
              expires_at TIMESTAMP NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_token (token),
              INDEX idx_email (email),
              INDEX idx_expires (expires_at)
            )
          `, (err, result) => {
            if (err) {
              console.error('❌ Error creating password_reset_tokens table:', err);
              reject(err);
            } else {
              console.log('✅ password_reset_tokens table created successfully');
              resolve(result);
            }
          });
        });
      } else {
        console.log('✅ password_reset_tokens table exists');
      }
      
    } catch (error) {
      console.error('❌ Error ensuring password reset table:', error);
      throw error;
    } finally {
      if (db) {
        try {
          db.end();
        } catch (closeError) {
          console.error('❌ Error closing database connection:', closeError);
        }
      }
    }
  }
}

export default PasswordResetService; 