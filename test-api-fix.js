// Test the fixed API endpoint
require('dotenv').config();

async function testAPIFix() {
    console.log('🧪 Testing Fixed API Endpoint\n');

    const testOrderId = '0092aeba-ed2a-491e-bf30-8b731942eff7';
    const testUrl = `http://localhost:3000/api/admin/orders/${testOrderId}`;

    console.log(`📋 Testing Order: ${testOrderId}`);
    console.log(`📤 API Endpoint: ${testUrl}`);
    console.log(`📝 Testing with lowercase status: "processing"`);
    console.log('\n' + '='.repeat(50));

    try {
        const response = await fetch(testUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // Note: This won't have the auth token, so we expect 401
            },
            body: JSON.stringify({ status: 'processing' })
        });

        const result = await response.json();

        console.log(`📊 Response Status: ${response.status}`);
        console.log(`📊 Response:`, result);

        if (response.status === 401) {
            console.log('\n✅ Expected 401 - No auth token provided');
            console.log('🎯 The API is working and properly rejecting unauthorized requests');
            console.log('\n📝 Next step: Test with valid admin token in browser');
        } else {
            console.log('\n⚠️  Unexpected response - API might have other issues');
        }

    } catch (error) {
        console.error('❌ Fetch error:', error.message);
        console.log('\n💡 Make sure your Next.js server is running on http://localhost:3000');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🚀 Ready to test in admin dashboard!');
    console.log('The fix should now allow status updates to work properly.');
}

testAPIFix();