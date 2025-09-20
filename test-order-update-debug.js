// Test admin order status update with actual browser token
require('dotenv').config();

// First test if we can get the current token from browser
console.log('🧪 Admin Order Status Update Test\n');

console.log('📋 Available Orders for Testing:');
console.log('1. 0092aeba-ed2a-491e-bf30-8b731942eff7 (Victor Kipkirui - £134.98)');
console.log('2. c3cc5196-9f0b-4199-b5ea-d0482a2b4c48 (Pamela - £69.99)');
console.log('3. f2031256-3cae-40e0-bc2e-ad94b313edef (Victor Kipkirui - £89.99)');

console.log('\n📝 To test the admin order status update:');
console.log('1. Open your browser Developer Tools (F12)');
console.log('2. Go to Application/Storage tab → Cookies');
console.log('3. Find the "auth-token" cookie value');
console.log('4. Copy the entire token value');
console.log('5. Run this test:');

console.log('\n📤 Test Command Example:');
console.log('curl -X PATCH "http://localhost:3000/api/admin/orders/0092aeba-ed2a-491e-bf30-8b731942eff7" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Cookie: auth-token=YOUR_TOKEN_HERE" \\');
console.log('  -d \'{"status": "processing"}\'');

console.log('\n🔍 Expected Responses:');
console.log('✅ Success: {"success":true,"order":{...}}');
console.log('❌ 401: {"error":"Unauthorized"} - No token or invalid token');
console.log('❌ 403: {"error":"Admin access required"} - Token valid but not admin role');
console.log('❌ 400: {"error":"Invalid status"} - Invalid status value');
console.log('❌ 404: {"error":"Order not found"} - Order ID doesn\'t exist');

console.log('\n🚀 Alternative: Test directly in browser console:');
console.log('');
console.log('fetch("/api/admin/orders/0092aeba-ed2a-491e-bf30-8b731942eff7", {');
console.log('  method: "PATCH",');
console.log('  headers: {');
console.log('    "Content-Type": "application/json"');
console.log('  },');
console.log('  body: JSON.stringify({status: "processing"})');
console.log('}).then(r => r.json()).then(console.log)');

console.log('\n💡 This will use your current browser session automatically!');