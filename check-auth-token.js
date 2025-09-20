// Check current authentication status
require('dotenv').config();
const jwt = require('jsonwebtoken');

function checkAuthToken() {
    console.log('🔐 Authentication Debug\n');

    console.log('📝 Steps to get your current auth token:');
    console.log('1. Open the admin page in your browser');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Application tab');
    console.log('4. Under Storage -> Cookies -> http://localhost:3001');
    console.log('5. Find "auth-token" cookie');
    console.log('6. Copy the value');
    console.log('');

    console.log('🧪 Test the token here:');
    console.log('Replace YOUR_TOKEN_HERE with the actual token value\n');

    const testToken = 'YOUR_TOKEN_HERE';

    if (testToken === 'YOUR_TOKEN_HERE') {
        console.log('❌ Please provide actual token to test');
        return;
    }

    try {
        const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
        console.log('✅ Token is valid!');
        console.log('Decoded token:', decoded);
        console.log(`User ID: ${decoded.userId}`);
        console.log(`Email: ${decoded.email}`);
        console.log(`Role: ${decoded.role}`);

        if (decoded.role === 'ADMIN') {
            console.log('✅ Role is ADMIN - should work for order updates');
        } else {
            console.log('❌ Role is not ADMIN - this is why order updates fail!');
        }
    } catch (error) {
        console.log('❌ Token is invalid:', error.message);
    }
}

checkAuthToken();