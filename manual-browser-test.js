// Manual browser console test for admin order status update
// Copy and paste this entire script into your browser console on the admin page

console.log('🧪 Manual Admin API Test Starting...\n');

// Test order ID from your list
const testOrderId = '0092aeba-ed2a-491e-bf30-8b731942eff7';
const testStatus = 'processing';

console.log(`📋 Testing Order: ${testOrderId}`);
console.log(`📋 New Status: ${testStatus}`);
console.log('');

// Check authentication first
const authToken = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
console.log('🔐 Auth Token Present:', !!authToken);
if (authToken) {
    console.log('🔐 Auth Token Length:', authToken.length);
    console.log('🔐 Auth Token Start:', authToken.substring(0, 20) + '...');
} else {
    console.log('❌ No auth token found! You need to log in again.');
}
console.log('');

// Manual fetch test
console.log('🚀 Making API Request...');

fetch(`/api/admin/orders/${testOrderId}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: testStatus })
})
    .then(async response => {
        console.log('📊 Response Details:');
        console.log('   Status:', response.status);
        console.log('   Status Text:', response.statusText);
        console.log('   OK:', response.ok);
        console.log('   URL:', response.url);

        // Get headers
        const headers = {};
        for (let [key, value] of response.headers.entries()) {
            headers[key] = value;
        }
        console.log('   Headers:', headers);

        // Get response body
        const responseText = await response.text();
        console.log('   Response Body:', responseText);

        // Try to parse as JSON
        try {
            const responseJson = JSON.parse(responseText);
            console.log('   Parsed JSON:', responseJson);
        } catch (e) {
            console.log('   (Could not parse as JSON)');
        }

        if (response.ok) {
            console.log('✅ SUCCESS! Order status update worked.');
        } else {
            console.log('❌ FAILED! Check the error details above.');

            // Specific error analysis
            if (response.status === 401) {
                console.log('🔍 DIAGNOSIS: Authentication failed - token invalid or missing');
            } else if (response.status === 403) {
                console.log('🔍 DIAGNOSIS: Authorization failed - user is not admin');
            } else if (response.status === 400) {
                console.log('🔍 DIAGNOSIS: Bad request - invalid status or malformed data');
            } else if (response.status === 404) {
                console.log('🔍 DIAGNOSIS: Order not found');
            } else if (response.status === 500) {
                console.log('🔍 DIAGNOSIS: Server error - check server console');
            }
        }
    })
    .catch(error => {
        console.error('❌ Network Error:', error);
    });

console.log('');
console.log('📝 Instructions:');
console.log('1. Check the output above for specific error details');
console.log('2. If 401/403 errors, try logging out and back in');
console.log('3. If 500 errors, check the Next.js server console');
console.log('4. If network errors, make sure the dev server is running');