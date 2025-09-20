// Database connection test to identify missing tables
require('dotenv').config();

async function checkDatabaseTables() {
    try {
        console.log('🔍 Checking Database Tables and Connection...\n');

        // Test if we can connect to the database
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient({
            log: ['query', 'error', 'warn'],
        });

        console.log('📡 Testing database connection...');

        // Test basic connection
        try {
            await prisma.$connect();
            console.log('✅ Database connection successful!');
        } catch (connectError) {
            console.log('❌ Database connection failed:', connectError.message);
            return;
        }

        // Check which tables exist
        console.log('\n📋 Checking for required tables...');

        const tables = [
            'users',
            'products',
            'orders',
            'order_items',
            'contact_messages',
            'support_messages',
            'payment_settings'
        ];

        for (const table of tables) {
            try {
                switch (table) {
                    case 'users':
                        await prisma.user.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                    case 'products':
                        await prisma.product.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                    case 'orders':
                        await prisma.order.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                    case 'order_items':
                        await prisma.orderItem.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                    case 'contact_messages':
                        await prisma.contactMessage.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                    case 'support_messages':
                        await prisma.supportMessage.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                    case 'payment_settings':
                        await prisma.paymentSetting.count();
                        console.log(`✅ ${table} table exists`);
                        break;
                }
            } catch (error) {
                console.log(`❌ ${table} table MISSING or has issues:`, error.message.split('\n')[0]);
            }
        }

        console.log('\n🔧 SOLUTION:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Open SQL Editor');
        console.log('3. Run the create-contact-messages-table.sql file');
        console.log('4. Restart your development server');
        console.log('5. Test the contact form and admin functions');

        await prisma.$disconnect();

    } catch (error) {
        console.error('❌ Database check failed:', error);
    }
}

checkDatabaseTables();