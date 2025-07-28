import express from 'express';
import { PasswordResetController } from '../controllers/PasswordResetController.js';

const router = express.Router();

// Request password reset
router.post('/forgot-password', PasswordResetController.requestPasswordReset);

// Verify reset token
router.get('/verify-token/:token', PasswordResetController.verifyResetToken);

// Reset password with token
router.post('/reset-password', PasswordResetController.resetPassword);

// Cleanup expired tokens (admin endpoint)
router.post('/cleanup-tokens', PasswordResetController.cleanupTokens);

export default router; 