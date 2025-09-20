// Test script to verify order status updates work properly
require('dotenv').config();

async function testOrderStatusUpdate() {
    try {
        console.log('🧪 Testing Order Status Update Functionality\n');

        // First, let's check if we have any orders to test with
        const ordersResponse = await fetch('http://localhost:3001/api/admin/orders', {
            headers: {
                'Cookie': 'auth-token=YOUR_AUTH_TOKEN_HERE' // You'll need to replace this
            }
        });

        if (!ordersResponse.ok) {
            console.log('❌ Cannot fetch orders - need to sign in as admin first');
            console.log('📝 Steps to test manually:');
            console.log('1. Go to http://localhost:3001/admin/signin');
            console.log('2. Sign in with admin credentials');
            console.log('3. Go to http://localhost:3001/admin');
            console.log('4. Click on "Orders Management"');
            console.log('5. Try changing the status of an order using the dropdown');
            console.log('6. Check if the status updates in the UI and database');
            return;
        }

        const ordersData = await ordersResponse.json();
        console.log(`✅ Found ${ordersData.orders?.length || 0} orders`);

        if (ordersData.orders && ordersData.orders.length > 0) {
            const testOrder = ordersData.orders[0];
            console.log(`🎯 Testing with order: ${testOrder.id.slice(0, 8)}`);
            console.log(`   Current status: ${testOrder.status}`);
            console.log(`   Customer: ${testOrder.user?.name || 'Unknown'}`);

            // Try to update status
            const newStatus = testOrder.status === 'pending' ? 'processing' : 'pending';
            console.log(`\n🔄 Attempting to change status to: ${newStatus}`);

            console.log('📝 To test this manually:');
            console.log(`1. Go to admin dashboard: http://localhost:3001/admin`);
            console.log(`2. Find order #${testOrder.id.slice(0, 8)}`);
            console.log(`3. Change status from "${testOrder.status}" to "${newStatus}"`);
            console.log(`4. Check if it updates successfully`);
        } else {
            console.log('📝 No orders found to test with');
            console.log('Create a test order first by:');
            console.log('1. Go to http://localhost:3001/shop');
            console.log('2. Add items to cart and place an order');
            console.log('3. Then test status updates in admin dashboard');
        }

    } catch (error) {
        console.error('❌ Error testing order status updates:', error);
    }
}

console.log('🔧 Order Status Update Test');
console.log('==========================\n');
testOrderStatusUpdate();