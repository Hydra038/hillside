const { PrismaClient } = require('@prisma/client');

async function testBasicUsersQuery() {
    const prisma = new PrismaClient();

    try {
        console.log('Testing basic Users query...');

        // Test with just the basic fields that should exist
        const usersData = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('Basic users data:', JSON.stringify(usersData, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
    } finally {
        await prisma.$disconnect();
    }
}

testBasicUsersQuery();