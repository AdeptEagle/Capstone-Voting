import dotenv from 'dotenv';
import EmailService from '../services/EmailService.js';

// Load environment variables
dotenv.config();

async function testGmailSetup() {
  console.log('🧪 Testing Gmail Email Setup...');
  console.log('===============================');
  
  // Check environment variables
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const frontendUrl = process.env.FRONTEND_URL;
  
  console.log('📋 Environment Variables Check:');
  console.log(`   GMAIL_USER: ${gmailUser ? '✅ Set' : '❌ Missing'}`);
  console.log(`   GMAIL_APP_PASSWORD: ${gmailPass ? '✅ Set' : '❌ Missing'}`);
  console.log(`   FRONTEND_URL: ${frontendUrl ? '✅ Set' : '❌ Missing'}`);
  console.log('');
  
  if (!gmailUser || !gmailPass) {
    console.error('❌ Missing required Gmail credentials!');
    console.log('');
    console.log('📝 To fix this:');
    console.log('   1. Enable 2FA on your Gmail account');
    console.log('   2. Generate an App Password');
    console.log('   3. Add GMAIL_USER and GMAIL_APP_PASSWORD to Railway environment variables');
    console.log('   4. Redeploy your backend');
    process.exit(1);
  }
  
  try {
    // Test email service initialization
    console.log('📧 Testing Gmail transporter initialization...');
    await EmailService.initializeTransporter();
    console.log('✅ Gmail transporter initialized successfully');
    
    // Test sending a password reset email
    console.log('');
    console.log('📧 Testing password reset email...');
    const testEmail = 'test@example.com';
    const testToken = 'test-token-123456789';
    const testUserType = 'voter';
    const testUserName = 'Test User';
    
    const result = await EmailService.sendPasswordResetEmail(
      testEmail, 
      testToken, 
      testUserType, 
      testUserName
    );
    
    console.log('✅ Password reset email test successful!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log('');
    console.log('🎉 Gmail setup is working correctly!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Deploy these changes to Railway');
    console.log('   2. Test the password reset feature on your frontend');
    console.log('   3. Monitor Railway logs for any issues');
    
  } catch (error) {
    console.error('❌ Gmail setup test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure 2FA is enabled on your Gmail account');
    console.log('   2. Verify you\'re using an App Password, not your regular password');
    console.log('   3. Check that the Gmail credentials are correctly set in Railway');
    console.log('   4. Ensure your Gmail account allows "less secure app access" or use App Passwords');
    process.exit(1);
  }
}

// Run the test
testGmailSetup().catch(console.error); 