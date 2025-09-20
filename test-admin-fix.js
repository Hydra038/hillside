require('dotenv').config();

async function testAdminPage() {
    try {
        console.log('🧪 Testing admin page database access...\n');

        // Test products API endpoint that the admin page now uses
        console.log('Testing products API endpoint...');
        const response = await fetch('http://localhost:3001/api/products');

        console.log('Response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Successfully fetched ${data.length} products`);

            if (data.length > 0) {
                console.log('Sample product:', {
                    id: data[0].id,
                    name: data[0].name,
                    stockQuantity: data[0].stockQuantity
                });
            }
        } else {
            const errorText = await response.text();
            console.log('❌ API Error:', errorText);
        }

    } catch (error) {
        console.error('Error testing admin page:', error.message);
        console.log('\n💡 Make sure the Next.js dev server is running on port 3001');
        console.log('Run: npm run dev');
    }
}

testAdminPage();