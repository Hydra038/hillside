// Test the email verification system without database dependency
import { sendEmail, generateVerificationEmailHtml } from '../src/lib/send-email.js';

async function demonstrateEmailVerification() {
  console.log('🧪 Email Verification System Demo');
  console.log('=================================\n');

  // Demo user data
  const testUser = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  // Generate a sample verification token
  const verificationToken = 'abc123-def456-ghi789-sample-token';
  
  // Create verification link
  const baseUrl = 'http://localhost:3002';
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(testUser.email)}`;

  console.log('📧 Generating verification email for:');
  console.log(`   Name: ${testUser.name}`);
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Verification Link: ${verificationLink}\n`);

  // Send the verification email (which will log to console)
  try {
    await sendEmail({
      to: testUser.email,
      subject: 'Verify Your Email - Hillside Logs Fuel',
      html: generateVerificationEmailHtml(testUser.name, verificationLink),
      text: `Hi ${testUser.name}! Please verify your email by clicking this link: ${verificationLink}`
    });

    console.log('✅ Email verification demo completed!');
    console.log('\n📝 Next steps in a real scenario:');
    console.log('1. User would receive the email shown above');
    console.log('2. User clicks the verification link');
    console.log('3. Visit: ' + verificationLink);
    console.log('4. Email gets verified and user can sign in');

  } catch (error) {
    console.error('❌ Error demonstrating email verification:', error);
  }
}

// Run the demo
demonstrateEmailVerification();
