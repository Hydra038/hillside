// Test script to verify frontend signup flow works
// Using built-in fetch (Node.js 18+)

async function testFrontendSignup() {
  console.log('🧪 Testing frontend signup integration...');
  
  try {
    // Test data for a new user
    const testUser = {
      name: "Frontend Test User",
      email: "frontend-test@example.com",
      password: "TestPassword123"
    };
    
    console.log('📝 Attempting to create account via signup API...');
    
    // Test the signup endpoint
    const response = await fetch('http://127.0.0.1:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    console.log(`📡 Response status: ${response.status}`);
    console.log(`📡 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Signup failed: ${errorText}`);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Signup successful!');
    console.log('📄 Response data:', JSON.stringify(data, null, 2));
    
    // Now test signing in with the new account
    console.log('\n🔐 Testing signin with the new account...');
    
    const signinResponse = await fetch('http://127.0.0.1:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    
    console.log(`📡 Signin response status: ${signinResponse.status}`);
    console.log(`📡 Signin response headers: ${JSON.stringify(Object.fromEntries(signinResponse.headers.entries()), null, 2)}`);
    
    if (!signinResponse.ok) {
      const errorText = await signinResponse.text();
      console.log(`❌ Signin failed: ${errorText}`);
      return;
    }
    
    const signinData = await signinResponse.json();
    console.log('✅ Signin successful!');
    console.log('👤 User data:', JSON.stringify(signinData.user, null, 2));
    
    // Extract and test the JWT cookie
    const setCookieHeader = signinResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 Set-Cookie header received:', setCookieHeader);
      
      // Test the /me endpoint with the cookie
      console.log('\n🔍 Testing /me endpoint with JWT cookie...');
      
      const meResponse = await fetch('http://127.0.0.1:3000/api/auth/me', {
        headers: {
          'Cookie': setCookieHeader,
        },
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('✅ JWT verification successful!');
        console.log('👤 User from JWT:', JSON.stringify(meData.user, null, 2));
      } else {
        console.log('❌ JWT verification failed');
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Run the test
testFrontendSignup();
