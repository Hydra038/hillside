// Test signup functionality
const testSignup = async () => {
  try {
    console.log('🧪 Testing signup API...');
    
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Signup successful!');
      console.log('Response:', data);
    } else {
      console.log('❌ Signup failed:');
      console.log('Status:', response.status);
      console.log('Error:', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testSignup();