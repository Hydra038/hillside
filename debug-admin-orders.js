// Debug script for admin order status update
require('dotenv').config();

async function debugAdminOrderUpdate() {
    try {
        console.log('🔍 Debugging Admin Order Status Update\n');

        // Test data - using one of the order IDs from the screenshot
        const orderId = '0092aeba'; // From the screenshot
        const newStatus = 'processing';

        console.log(`📋 Testing order update:`)
        console.log(`   Order ID: ${orderId}`)
        console.log(`   New Status: ${newStatus}`)
        console.log(`   URL: http://localhost:3001/api/admin/orders/${orderId}`)

        // You'll need to replace this with actual auth token from browser
        console.log('\n🔑 Authentication Required:')
        console.log('1. Open browser dev tools (F12)')
        console.log('2. Go to Application/Storage tab')
        console.log('3. Find "auth-token" cookie value')
        console.log('4. Replace YOUR_AUTH_TOKEN in this script')

        const authToken = 'YOUR_AUTH_TOKEN_HERE';

        if (authToken === 'YOUR_AUTH_TOKEN_HERE') {
            console.log('\n❌ Please set actual auth token to test API')
            console.log('\n📝 Manual Test Steps:')
            console.log('1. Open browser dev tools on admin page')
            console.log('2. Go to Network tab')
            console.log('3. Try to update an order status')
            console.log('4. Look for the API call to /api/admin/orders/[id]')
            console.log('5. Check the response for any error details')
            return;
        }

        const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `auth-token=${authToken}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        console.log(`\n📡 Response Status: ${response.status}`);
        console.log(`📡 Response Status Text: ${response.statusText}`);

        const responseData = await response.text();
        console.log(`📡 Response Body: ${responseData}`);

        if (response.ok) {
            console.log('✅ SUCCESS: Order status updated successfully!');
        } else {
            console.log('❌ FAILED: Order status update failed');
            console.log('Response:', responseData);
        }

    } catch (error) {
        console.error('❌ FAILED: Error testing admin order update:', error);
    }
}

console.log('🔧 Admin Order Status Update Debug');
console.log('==================================\n');
debugAdminOrderUpdate();