import express from 'express';
import { PasswordResetController } from '../controllers/PasswordResetController.js';

const router = express.Router();

// Health check for password reset service
router.get('/health', async (req, res) => {
  try {
    // Check if password reset table exists
    await PasswordResetController.verifyServiceHealth();
    res.status(200).json({
      success: true,
      message: 'Password reset service is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Password reset health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset service is unhealthy',
      details: error.message
    });
  }
});

// Request password reset
router.post('/forgot-password', PasswordResetController.requestPasswordReset);

// Verify reset token
router.get('/verify-token/:token', PasswordResetController.verifyToken);

// Reset password with token
router.post('/reset-password', PasswordResetController.resetPassword);

// Cleanup expired tokens (admin endpoint)
router.post('/cleanup-tokens', PasswordResetController.cleanupTokens);

export default router; 