// Check actual order IDs in database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkOrderIds() {
    const prisma = new PrismaClient();

    try {
        console.log('📋 Checking Order IDs in Database\n');

        const orders = await prisma.order.findMany({
            select: {
                id: true,
                status: true,
                total: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Found ${orders.length} orders:\n`);
        console.log('=====================================');

        orders.forEach((order, index) => {
            console.log(`${index + 1}. Order ID: ${order.id}`);
            console.log(`   Shortened: #${order.id.slice(0, 8)}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   Customer: ${order.user?.name || 'Unknown'}`);
            console.log(`   Total: £${order.total}`);
            console.log(`   Created: ${order.createdAt}`);
            console.log('---');
        });

        if (orders.length > 0) {
            const firstOrder = orders[0];
            console.log('\n🧪 Test URLs:');
            console.log(`Full ID API: /api/admin/orders/${firstOrder.id}`);
            console.log(`Short ID API: /api/admin/orders/${firstOrder.id.slice(0, 8)}`);
            console.log('\n📝 The admin interface should use the FULL ID, not the shortened version!');
        }

    } catch (error) {
        console.error('❌ Error checking orders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkOrderIds();