// Test database connection and API functionality
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
    console.log('🔧 Testing Database Connection and API Issues\n');

    const prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

    try {
        console.log('1. Testing database connection...');

        // Test basic connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Test if ContactMessage table exists and can be queried
        console.log('\n2. Testing ContactMessage table...');
        const existingMessages = await prisma.contactMessage.findMany({
            take: 1
        });
        console.log('✅ ContactMessage table accessible');
        console.log(`   Found ${existingMessages.length} existing messages`);

        // Test creating a contact message
        console.log('\n3. Testing contact message creation...');
        const testMessage = await prisma.contactMessage.create({
            data: {
                name: 'Database Test User',
                email: 'test@databasetest.com',
                subject: 'Database Connection Test',
                message: 'This is a test message to verify database functionality'
            }
        });
        console.log('✅ Contact message created successfully');
        console.log(`   Message ID: ${testMessage.id}`);

        // Test Order table for admin status updates
        console.log('\n4. Testing Order table...');
        const orders = await prisma.order.findMany({
            take: 1,
            include: {
                user: true,
                orderItems: true
            }
        });
        console.log('✅ Order table accessible');
        console.log(`   Found ${orders.length} orders`);

        if (orders.length > 0) {
            console.log('\n5. Testing order status update...');
            const testOrder = orders[0];
            console.log(`   Testing with order: ${testOrder.id.slice(0, 8)}`);
            console.log(`   Current status: ${testOrder.status}`);

            // Try updating the order status
            const newStatus = testOrder.status === 'PENDING' ? 'PROCESSING' : 'PENDING';
            const updatedOrder = await prisma.order.update({
                where: { id: testOrder.id },
                data: { status: newStatus }
            });
            console.log('✅ Order status update successful');
            console.log(`   Updated status: ${updatedOrder.status}`);

            // Revert the status back
            await prisma.order.update({
                where: { id: testOrder.id },
                data: { status: testOrder.status }
            });
            console.log('✅ Reverted status back to original');
        } else {
            console.log('   No orders found to test status update');
        }

        console.log('\n🎉 All database tests passed!');
        console.log('\n📋 If APIs are still failing, the issue is likely:');
        console.log('1. Environment variables not loading in development server');
        console.log('2. Prisma client not properly initialized in API routes');
        console.log('3. CORS or authentication issues');

    } catch (error) {
        console.error('❌ Database test failed:', error);
        console.log('\n💡 Troubleshooting steps:');
        console.log('1. Check if .env.local file is properly configured');
        console.log('2. Verify DATABASE_URL is correct');
        console.log('3. Run: npx prisma generate');
        console.log('4. Run: npx prisma db push');
    } finally {
        await prisma.$disconnect();
    }
}

testDatabaseConnection();