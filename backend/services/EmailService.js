import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initializeTransporter() {
    if (this.transporter) return this.transporter;

    try {
      // Check for Gmail credentials
      const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
      const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
      
      console.log('📧 Initializing Gmail email transporter...');
      console.log(`   Environment: ${process.env.NODE_ENV}`);
      console.log(`   Gmail User: ${gmailUser ? 'Configured' : 'Missing'}`);
      console.log(`   Gmail Password: ${gmailPass ? 'Configured' : 'Missing'}`);

      if (!gmailUser || !gmailPass) {
        throw new Error('Gmail credentials are required. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
      }

      // Create Gmail transporter
      console.log('📧 Creating Gmail transporter...');
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        // Additional options for better reliability
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      });

      console.log('📧 Email Service: Using Gmail for production');
      console.log(`   Gmail User: ${gmailUser}`);

      // Verify transporter connection
      console.log('📧 Verifying Gmail transporter connection...');
      await this.transporter.verify();
      console.log('✅ Gmail transporter verified successfully');

      return this.transporter;

    } catch (error) {
      console.error('❌ Gmail transporter initialization failed:', error);
      
      if (error.code === 'EAUTH') {
        throw new Error('Gmail authentication failed. Please check your Gmail credentials and ensure 2FA is enabled with an App Password.');
      } else if (error.code === 'ECONNECTION') {
        throw new Error('Gmail connection failed. Please check your internet connection and try again.');
      } else {
        throw new Error(`Gmail service initialization failed: ${error.message}`);
      }
    }
  }

  async sendPasswordResetEmail(email, resetToken, userType, userName) {
    try {
      console.log(`📧 Sending password reset email to: ${email}`);
      
      const transporter = await this.initializeTransporter();
      
      const resetUrl = `${process.env.FRONTEND_URL || 'https://sscelection2025.vercel.app'}/reset-password?token=${resetToken}&type=${userType}`;
      
      const emailTemplate = this.createPasswordResetTemplate(userName, resetUrl, userType);
      
      const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
      
      const mailOptions = {
        from: `"Voting System" <${gmailUser}>`,
        to: email,
        subject: 'Password Reset Request - Voting System',
        html: emailTemplate,
        text: this.createTextVersion(userName, resetUrl, userType)
      };

      console.log('📧 Sending email via Gmail...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully via Gmail');
      console.log(`📧 Email Details:`);
      console.log(`   To: ${email}`);
      console.log(`   Subject: ${mailOptions.subject}`);
      console.log(`   Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: null // No preview URL for Gmail
      };

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      
      // Provide specific error messages for different Gmail issues
      if (error.code === 'EAUTH') {
        throw new Error('Gmail authentication failed. Please check your Gmail credentials and ensure 2FA is enabled with an App Password.');
      } else if (error.code === 'ECONNECTION') {
        throw new Error('Gmail connection failed. Please check your internet connection and try again.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Gmail timeout. Please try again later.');
      } else if (error.code === 'EENVELOPE') {
        throw new Error('Invalid email address. Please check the recipient email.');
      } else {
        throw new Error(`Failed to send password reset email: ${error.message}`);
      }
    }
  }

  createPasswordResetTemplate(userName, resetUrl, userType) {
    const userTypeText = userType === 'admin' ? 'Administrator' : 'Voter';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Voting System</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗳️ Voting System</h1>
            <p>Password Reset Request</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userName || 'there'}!</h2>
            
            <p>We received a request to reset your password for your ${userTypeText} account in the Voting System.</p>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in <strong>15 minutes</strong></li>
                <li>You can only use this link once</li>
                <li>If the link expires, you'll need to request a new password reset</li>
              </ul>
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            
            <p>Best regards,<br>The Voting System Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have any questions, contact your system administrator.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  createTextVersion(userName, resetUrl, userType) {
    const userTypeText = userType === 'admin' ? 'Administrator' : 'Voter';
    
    return `
Password Reset Request - Voting System

Hello ${userName || 'there'}!

We received a request to reset your password for your ${userTypeText} account in the Voting System.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

To reset your password, click the following link:
${resetUrl}

IMPORTANT:
- This link will expire in 15 minutes
- You can only use this link once
- If the link expires, you'll need to request a new password reset

If the link above doesn't work, copy and paste it into your browser.

Best regards,
The Voting System Team

---
This is an automated message. Please do not reply to this email.
If you have any questions, contact your system administrator.
    `;
  }

  async testEmailService() {
    try {
      console.log('🧪 Testing Gmail Email Service...');
      
      const testEmail = 'test@example.com';
      const testToken = 'test-token-123';
      const testUserType = 'voter';
      const testUserName = 'Test User';
      
      const result = await this.sendPasswordResetEmail(testEmail, testToken, testUserType, testUserName);
      
      console.log('✅ Gmail email service test successful!');
      console.log(`   Message ID: ${result.messageId}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Gmail email service test failed:', error);
      throw error;
    }
  }
}

export default new EmailService(); 