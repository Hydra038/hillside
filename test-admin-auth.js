// Test admin authentication endpoint
require('dotenv').config();

async function testAdminAuth() {
    try {
        console.log('🔍 Testing Admin Authentication\n');

        // Test the admin orders endpoint to see authentication status
        console.log('📡 Testing: GET /api/admin/orders');
        console.log('URL: http://localhost:3001/api/admin/orders\n');

        const response = await fetch('http://localhost:3001/api/admin/orders', {
            method: 'GET',
            credentials: 'include', // Include cookies
        });

        console.log(`Status: ${response.status}`);
        console.log(`Status Text: ${response.statusText}`);

        if (response.status === 401) {
            console.log('❌ Authentication failed - user not signed in or token invalid');
        } else if (response.status === 403) {
            console.log('❌ Authorization failed - user signed in but not admin role');
        } else if (response.status === 200) {
            console.log('✅ Authentication successful - admin access confirmed');
            const data = await response.json();
            console.log(`Found ${data.orders?.length || 0} orders`);
        } else {
            console.log('❌ Unexpected response');
            const text = await response.text();
            console.log('Response:', text);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n📝 Make sure:');
        console.log('1. Development server is running (npm run dev)');
        console.log('2. You are signed in as admin in the browser');
        console.log('3. Browser and test are using same localhost port');
    }
}

testAdminAuth();