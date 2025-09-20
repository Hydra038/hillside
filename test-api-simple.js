// Simple test for the admin API endpoint
const orderId = '0092aeba-ed2a-491e-bf30-8b731942eff7';
const apiUrl = `http://localhost:3000/api/admin/orders/${orderId}`;

console.log('🧪 Testing Admin Order Status Update API\n');
console.log('📋 Test Details:');
console.log(`   Order ID: ${orderId}`);
console.log(`   API URL: ${apiUrl}`);
console.log(`   Status: processing`);
console.log('');

fetch(apiUrl, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'processing' })
})
    .then(response => {
        console.log('📊 Response Details:');
        console.log(`   Status Code: ${response.status}`);
        console.log(`   Status Text: ${response.statusText}`);
        console.log(`   URL: ${response.url}`);

        return response.text().then(text => {
            console.log(`   Response Body: ${text}`);

            if (response.status === 401) {
                console.log('\n✅ Expected 401 - Authentication required');
                console.log('   This confirms the API endpoint is working');
                console.log('   The issue is likely with authentication in the browser');
            } else if (response.status === 200) {
                console.log('\n✅ Success! API is working properly');
            } else {
                console.log(`\n❌ Unexpected status: ${response.status}`);
            }
        });
    })
    .catch(error => {
        console.error('❌ Network Error:', error.message);
        console.log('\n💡 Make sure your Next.js server is running on http://localhost:3000');
    });

console.log('\n🔍 Next Steps:');
console.log('1. Check if you\'re logged in as admin in the browser');
console.log('2. Open browser dev tools and check the auth-token cookie');
console.log('3. Try the update again in the admin interface');
console.log('4. Check the enhanced error logging in browser console');