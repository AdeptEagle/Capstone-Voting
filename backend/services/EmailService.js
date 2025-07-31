import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isTestMode = process.env.NODE_ENV !== 'production';
  }

  async initializeTransporter() {
    if (this.transporter) return this.transporter;

    if (this.isTestMode) {
      // Use Ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log('📧 Email Service: Using Ethereal for testing');
      console.log(`   Test Account: ${testAccount.user}`);
      console.log(`   Preview URL: https://ethereal.email`);
    } else {
      // Use Gmail for production
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      console.log('📧 Email Service: Using Gmail for production');
    }

    return this.transporter;
  }

  async sendPasswordResetEmail(email, resetToken, userType, userName) {
    try {
      const transporter = await this.initializeTransporter();
      
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&type=${userType}`;
      
      const emailTemplate = this.createPasswordResetTemplate(userName, resetUrl, userType);
      
      const mailOptions = {
        from: this.isTestMode ? '"Voting System Test" <test@ethereal.email>' : `"Voting System" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - Voting System',
        html: emailTemplate,
        text: this.createTextVersion(userName, resetUrl, userType)
      };

      const info = await transporter.sendMail(mailOptions);

      if (this.isTestMode) {
        console.log('📧 TEST EMAIL SENT:');
        console.log('===================');
        console.log(`To: ${email}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('===================');
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: this.isTestMode ? nodemailer.getTestMessageUrl(info) : null
      };

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send password reset email');
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
      console.log('🧪 Testing Email Service...');
      
      const testEmail = 'test@example.com';
      const testToken = 'test-token-123';
      const testUserType = 'voter';
      const testUserName = 'Test User';
      
      const result = await this.sendPasswordResetEmail(testEmail, testToken, testUserType, testUserName);
      
      console.log('✅ Email service test successful!');
      console.log(`   Message ID: ${result.messageId}`);
      if (result.previewUrl) {
        console.log(`   Preview URL: ${result.previewUrl}`);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Email service test failed:', error);
      throw error;
    }
  }
}

export default new EmailService(); 