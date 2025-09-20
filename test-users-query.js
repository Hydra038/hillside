const { PrismaClient } = require('@prisma/client');

async function testUsersQuery() {
    const prisma = new PrismaClient();

    try {
        console.log('Testing Users API query...');

        // This is the same query the users API uses
        const usersData = await prisma.user.findMany({
            include: {
                orders: {
                    select: {
                        total: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('Raw users data:', usersData.length, 'users found');

        const usersWithStats = usersData.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            orderCount: user.orders.length,
            totalSpent: user.orders.reduce((sum, order) => sum + Number(order.total), 0)
        }));

        console.log('Processed users:', JSON.stringify(usersWithStats, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
    } finally {
        await prisma.$disconnect();
    }
}

testUsersQuery();