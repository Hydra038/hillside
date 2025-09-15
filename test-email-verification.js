// Test Email Verification System
// This script demonstrates the email verification flow

async function testEmailVerification() {
  const testEmail = 'test@example.com';
  const testName = 'Test User';
  const testPassword = 'password123';

  console.log('🧪 Testing Email Verification System');
  console.log('====================================');

  try {
    // 1. Test user signup with email verification
    console.log('\n1. Creating test user...');
    const signupResponse = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });

    const signupData = await signupResponse.json();
    console.log('Signup Response:', signupData);

    if (signupResponse.ok) {
      console.log('✅ User created successfully');
      console.log('📧 Check the terminal for the verification email (logged to console)');
      
      // The verification email will be logged to the server console
      // In a real application, the user would receive this email
      console.log('\n📝 Next Steps:');
      console.log('1. Check the server terminal for the verification email');
      console.log('2. Copy the verification link from the email');
      console.log('3. Visit the verification link in your browser');
      console.log('4. Your email will be verified and you can sign in');
    } else {
      console.log('❌ Signup failed:', signupData.error);
    }

  } catch (error) {
    console.error('Error testing email verification:', error);
  }
}

// Run the test
testEmailVerification();
