require('dotenv').config();

async function testAuthMeAPI() {
    try {
        console.log('🧪 Testing /api/auth/me endpoint...\n');

        // Test the me endpoint without token first
        console.log('Testing without token...');
        const response1 = await fetch('http://localhost:3001/api/auth/me');
        console.log('Response status (no token):', response1.status);

        if (response1.status === 401) {
            console.log('✅ Correctly returns 401 for missing token');
        } else {
            const text = await response1.text();
            console.log('Unexpected response:', text);
        }

        console.log('\n💡 To test with valid token:');
        console.log('1. Sign in first to get a token');
        console.log('2. The token will be set as httpOnly cookie');
        console.log('3. Then /api/auth/me will work properly');

    } catch (error) {
        console.error('Error testing auth/me API:', error.message);
        console.log('\n💡 Make sure the Next.js dev server is running on port 3001');
        console.log('Run: npm run dev');
    }
}

testAuthMeAPI();