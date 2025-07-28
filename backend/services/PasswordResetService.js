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
      
      // Store token in database
      const resetToken = {
        id: crypto.randomUUID(),
        user_id: user.id,
        user_type: userType,
        token: token,
        expires_at: expiresAt,
        used: false
      };
      
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO password_reset_tokens (id, user_id, user_type, token, expires_at, used) VALUES (?, ?, ?, ?, ?, ?)',
          [resetToken.id, resetToken.user_id, resetToken.user_type, resetToken.token, resetToken.expires_at, resetToken.used],
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
          'SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()',
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
      
      // Update user password
      if (resetToken.user_type === 'voter') {
        await VoterModel.updatePassword(resetToken.user_id, hashedPassword);
      } else if (resetToken.user_type === 'admin') {
        await AdminModel.updatePassword(resetToken.user_id, hashedPassword);
      }
      
      // Mark token as used
      await new Promise((resolve, reject) => {
        db.query(
          'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
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
          'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE',
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