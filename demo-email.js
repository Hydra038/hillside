// Email Verification Demo - Direct Function Test
console.log('🧪 Email Verification System Demo');
console.log('=================================\n');

// Mock data
const testUser = {
  name: 'John Doe',
  email: 'john.doe@example.com'
};

const verificationToken = '12345-abcdef-67890-sample-token';
const baseUrl = 'http://localhost:3002';
const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(testUser.email)}`;

console.log('🔧 Test Configuration:');
console.log(`   User: ${testUser.name} (${testUser.email})`);
console.log(`   Token: ${verificationToken}`);
console.log(`   Link: ${verificationLink}\n`);

// Email template content
const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email - Hillside Logs Fuel</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d97706, #ea580c); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .button { display: inline-block; background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔥 Hillside Logs Fuel</h1>
      <p>Welcome to our community!</p>
    </div>
    <div class="content">
      <h2>Hi ${testUser.name}!</h2>
      <p>Thank you for signing up with Hillside Logs Fuel. To complete your registration and start ordering premium firewood, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify My Email Address</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationLink}</p>
      
      <p>This verification link will expire in 24 hours for security reasons.</p>
      
      <hr style="margin: 30px 0; border: 1px solid #eee;">
      
      <p><strong>What's next?</strong></p>
      <ul>
        <li>Browse our premium firewood selection</li>
        <li>Enjoy free local delivery</li>
        <li>Get expert advice on firewood storage</li>
        <li>Access special member discounts</li>
      </ul>
    </div>
    <div class="footer">
      <p>© 2025 Hillside Logs Fuel. All rights reserved.</p>
      <p>Quality firewood delivered to your door.</p>
    </div>
  </div>
</body>
</html>
`;

// Simulate sending email (console output)
console.log('📧 EMAIL VERIFICATION - Testing Mode');
console.log('=====================================');
console.log(`To: ${testUser.email}`);
console.log('Subject: Verify Your Email - Hillside Logs Fuel');
console.log('HTML Content:');
console.log(emailHtml);
console.log('=====================================\n');

console.log('✅ Email verification demo completed!');
console.log('\n📝 Next steps in a real scenario:');
console.log('1. User would receive the email shown above');
console.log('2. User clicks the verification link');
console.log('3. Visit: ' + verificationLink);
console.log('4. Email gets verified and user can sign in');
console.log('\n🔗 To test the verification page, copy this link:');
console.log(verificationLink);
