// Script to create missing database tables
require('dotenv').config();

async function createMissingTables() {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        console.log('🔧 Creating missing database tables...\n');

        // Create contact_messages table
        console.log('📝 Creating contact_messages table...');
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        replied BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Create support_messages table  
        console.log('📝 Creating support_messages table...');
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        sender TEXT NOT NULL CHECK (sender IN ('USER', 'ADMIN')),
        message TEXT NOT NULL,
        thread_id INTEGER,
        created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Add indexes
        console.log('📝 Adding indexes...');
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at)`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS contact_messages_replied_idx ON contact_messages(replied)`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS support_messages_user_id_idx ON support_messages(user_id)`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS support_messages_thread_id_idx ON support_messages(thread_id)`;

        console.log('✅ Successfully created missing tables!');

        // Test the tables
        console.log('\n🧪 Testing table access...');
        const contactCount = await prisma.contactMessage.count();
        const supportCount = await prisma.supportMessage.count();

        console.log(`✅ contact_messages table: ${contactCount} records`);
        console.log(`✅ support_messages table: ${supportCount} records`);

        console.log('\n🎉 Database setup complete! You can now:');
        console.log('1. Submit contact forms successfully');
        console.log('2. Use admin functions without errors');
        console.log('3. Access support messaging features');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
        console.log('\n🔧 MANUAL SOLUTION:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Navigate to your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Run the create-missing-tables.sql file');
    } finally {
        await prisma.$disconnect();
    }
}

createMissingTables();