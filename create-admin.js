require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createHardcodedAdmin() {
    const prisma = new PrismaClient();

    try {
        console.log('🔐 Creating hardcoded admin user...\n');

        const adminEmail = 'support@firewoodlogsfuel.com';
        const adminPassword = 'Derq@038!';
        const adminName = 'Support Admin';

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            console.log(`⚠️  User ${adminEmail} already exists`);
            console.log(`Current role: ${existingUser.role}`);

            if (existingUser.role !== 'ADMIN') {
                // Update to admin role
                await prisma.user.update({
                    where: { email: adminEmail },
                    data: { role: 'ADMIN' }
                });
                console.log('✅ Updated existing user to ADMIN role');
            }

            // Update password to the hardcoded one
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    password: hashedPassword,
                    emailVerified: true
                }
            });
            console.log('✅ Updated password and email verification status');

        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(adminPassword, 12);

            // Create new admin user
            const newAdmin = await prisma.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            console.log('✅ Created new admin user successfully!');
            console.log(`ID: ${newAdmin.id}`);
        }

        console.log('\n📋 ADMIN LOGIN CREDENTIALS:');
        console.log('==============================');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`Role: ADMIN`);
        console.log(`Login URL: http://localhost:3001/admin/signin`);

        // Verify the user can be found and authenticated
        console.log('\n🔍 Verification:');
        const verifyUser = await prisma.user.findUnique({
            where: { email: adminEmail },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                createdAt: true
            }
        });

        if (verifyUser) {
            console.log('✅ Admin user found in database');
            console.log('✅ Role:', verifyUser.role);
            console.log('✅ Email verified:', verifyUser.emailVerified);
            console.log('✅ Created:', verifyUser.createdAt);
        } else {
            console.log('❌ Admin user not found in database');
        }

        // Test password verification
        const testUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (testUser) {
            const passwordMatch = await bcrypt.compare(adminPassword, testUser.password);
            console.log('✅ Password verification:', passwordMatch ? 'PASSED' : 'FAILED');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createHardcodedAdmin();