// Check order status enum values in database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkOrderStatusValues() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Checking Order Status Values\n');

        // Check current order statuses
        const statusCounts = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        console.log('📊 Current Status Distribution:');
        statusCounts.forEach(item => {
            console.log(`   ${item.status}: ${item._count.status} orders`);
        });

        // Try to get one order and check its status field type
        const sampleOrder = await prisma.order.findFirst({
            select: {
                id: true,
                status: true
            }
        });

        if (sampleOrder) {
            console.log(`\n📝 Sample Order Status:`, sampleOrder.status);
            console.log(`📝 Type:`, typeof sampleOrder.status);
        }

        // Try updating one order to test if it works at DB level
        console.log('\n🧪 Testing Direct DB Update...');
        const testOrder = await prisma.order.findFirst({
            where: {
                status: 'PENDING' // Might be uppercase in DB
            }
        });

        if (testOrder) {
            console.log(`Testing update on order: ${testOrder.id}`);

            try {
                await prisma.order.update({
                    where: { id: testOrder.id },
                    data: { status: 'PROCESSING' } // Using uppercase to match enum
                });
                console.log('✅ Direct DB update successful with uppercase status');

                // Revert back
                await prisma.order.update({
                    where: { id: testOrder.id },
                    data: { status: 'PENDING' }
                });
                console.log('✅ Reverted back to original status');
            } catch (error) {
                console.log('❌ Direct DB update failed:', error.message);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkOrderStatusValues();