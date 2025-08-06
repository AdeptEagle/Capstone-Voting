import PasswordResetService from '../services/PasswordResetService.js';

export class PasswordResetController {
  static async requestPasswordReset(req, res) {
    try {
      const { email, userType } = req.body;
      
      if (!email || !userType) {
        return res.status(400).json({ 
          error: 'Email and user type are required' 
        });
      }
      
      if (!['voter', 'admin'].includes(userType)) {
        return res.status(400).json({ 
          error: 'User type must be either "voter" or "admin"' 
        });
      }
      
      // Ensure password reset table exists
      try {
        await PasswordResetService.ensurePasswordResetTable();
      } catch (tableError) {
        console.error('❌ Failed to ensure password reset table:', tableError);
        return res.status(500).json({ 
          error: 'System configuration error. Please contact administrator.' 
        });
      }
      
      const result = await PasswordResetService.generateResetToken(email, userType);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully. Please check your email for the reset link.',
        previewUrl: result.previewUrl // Only in test mode
      });
      
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to generate password reset link' 
      });
    }
  }

  static async verifyToken(req, res) {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ 
          error: 'Token is required' 
        });
      }
      
      const resetToken = await PasswordResetService.verifyResetToken(token);
      
      res.status(200).json({
        success: true,
        message: 'Token is valid',
        email: resetToken.email,
        userType: resetToken.user_type
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).json({ 
        error: error.message || 'Invalid or expired token' 
      });
    }
  }
  
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ 
          error: 'Token and new password are required' 
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        });
      }
      
      const result = await PasswordResetService.resetPassword(token, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
      
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to reset password' 
      });
    }
  }

  static async verifyServiceHealth() {
    try {
      // Check if password reset table exists
      await PasswordResetService.ensurePasswordResetTable();
      
      // Test email service initialization (without sending)
      const EmailService = (await import('../services/EmailService.js')).default;
      await EmailService.initializeTransporter();
      
      return { success: true, message: 'Password reset service is healthy' };
    } catch (error) {
      throw new Error(`Password reset service health check failed: ${error.message}`);
    }
  }
  
  static async cleanupTokens(req, res) {
    try {
      await PasswordResetService.cleanupExpiredTokens();
      
      res.status(200).json({
        success: true,
        message: 'Expired tokens cleaned up successfully'
      });
      
    } catch (error) {
      console.error('Token cleanup error:', error);
      res.status(500).json({ 
        error: 'Failed to cleanup tokens' 
      });
    }
  }
} 