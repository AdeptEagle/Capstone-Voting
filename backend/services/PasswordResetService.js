import { createConnection } from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { VoterModel } from '../models/VoterModel.js';
import { AdminModel } from '../models/AdminModel.js';

class PasswordResetService {
  static async generateResetToken(email, userType) {
    const db = createConnection();
    
    try {
      // Check if user exists
      let user;
      if (userType === 'voter') {
        user = await VoterModel.getByEmail(email);
      } else if (userType === 'admin') {
        user = await AdminModel.getByEmail(email);
      }
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      // Format expires_at for MySQL (UTC)
      const expiresAtUTC = expiresAt.toISOString().slice(0, 19).replace('T', ' ');
      
      // Store token in database
      const resetToken = {
        id: crypto.randomUUID(),
        email: email,
        token: token,
        user_type: userType,
        expires_at: expiresAtUTC
      };
      
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO password_reset_tokens (id, email, token, user_type, expires_at) VALUES (?, ?, ?, ?, ?)',
          [resetToken.id, resetToken.email, resetToken.token, resetToken.user_type, resetToken.expires_at],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      
      // For testing: log the reset link
      const resetLink = `http://localhost:5174/reset-password?token=${token}&type=${userType}`;
      console.log('🔐 PASSWORD RESET LINK (FOR TESTING):');
      console.log('=====================================');
      console.log(`Email: ${email}`);
      console.log(`User Type: ${userType}`);
      console.log(`Reset Link: ${resetLink}`);
      console.log(`Token: ${token}`);
      console.log(`Expires: ${expiresAt}`);
      console.log('=====================================');
      
      return { success: true, message: 'Password reset link generated successfully' };
      
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }
  
  static async verifyResetToken(token) {
    const db = createConnection();
    
    try {
      const result = await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > UTC_TIMESTAMP()',
          [token],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });
      
      if (result.length === 0) {
        throw new Error('Invalid or expired token');
      }
      
      return result[0];
      
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }
  
  static async resetPassword(token, newPassword) {
    const db = createConnection();
    
    try {
      // Verify token
      const resetToken = await this.verifyResetToken(token);
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Find user by email and update password
      let user = await VoterModel.getByEmail(resetToken.email);
      if (user) {
        await VoterModel.updatePassword(user.id, hashedPassword);
      } else {
        user = await AdminModel.getByEmail(resetToken.email);
        if (user) {
          await AdminModel.updatePassword(user.id, hashedPassword);
        } else {
          throw new Error('User not found');
        }
      }
      
      // Delete the used token
      await new Promise((resolve, reject) => {
        db.query(
          'DELETE FROM password_reset_tokens WHERE token = ?',
          [token],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      
      return { success: true, message: 'Password reset successfully' };
      
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }
  
  static async cleanupExpiredTokens() {
    const db = createConnection();
    
    try {
      await new Promise((resolve, reject) => {
        db.query(
          'DELETE FROM password_reset_tokens WHERE expires_at < NOW()',
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      
      console.log('🧹 Cleaned up expired password reset tokens');
      
    } catch (error) {
      console.error('Error cleaning up tokens:', error);
    } finally {
      db.end();
    }
  }
}

export default PasswordResetService; 