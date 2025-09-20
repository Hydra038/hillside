// Check user roles in database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkUserRoles() {
    const prisma = new PrismaClient();

    try {
        console.log('👥 Checking User Roles in Database\n');

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        console.log('📋 Current Users:');
        console.log('================');
        users.forEach(user => {
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role} ${user.role === 'ADMIN' ? '✅' : '❌'}`);
            console.log(`Created: ${user.createdAt}`);
            console.log('---');
        });

        // Check specifically for Support Admin
        const supportAdmin = users.find(u => u.email === 'support@firewoodlogsfuel.com');

        if (supportAdmin) {
            console.log('\n🔍 Support Admin Account:');
            console.log(`Current Role: ${supportAdmin.role}`);

            if (supportAdmin.role !== 'ADMIN') {
                console.log('❌ ISSUE FOUND: Support Admin role is not ADMIN!');
                console.log('\n🔧 Fixing Support Admin role...');

                await prisma.user.update({
                    where: { email: 'support@firewoodlogsfuel.com' },
                    data: { role: 'ADMIN' }
                });

                console.log('✅ SUCCESS: Support Admin role updated to ADMIN');
            } else {
                console.log('✅ Support Admin role is correct');
            }
        } else {
            console.log('❌ Support Admin account not found!');
        }

    } catch (error) {
        console.error('❌ Error checking user roles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUserRoles();