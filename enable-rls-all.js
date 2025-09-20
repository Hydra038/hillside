const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Use the hardcoded URL since env loading isn't working
const DATABASE_URL = 'postgresql://postgres:Derq@038!@db.fyjmczdbllubrssixpnx.supabase.co:5432/postgres';

async function enableRLSForAllTables() {
    try {
        // Import postgres after we've set up the environment
        const postgres = require('postgres');

        console.log('🔒 Enabling Row Level Security for all tables...');

        const sql = postgres(DATABASE_URL, {
            ssl: 'require'
        });

        // Read the SQL file
        const sqlContent = fs.readFileSync('enable-rls-all-tables.sql', 'utf8');

        // Execute the SQL
        await sql.unsafe(sqlContent);

        console.log('✅ RLS enabled successfully for all tables!');
        console.log('\n📋 RLS Policies Created:');
        console.log('   • Users: Can view/edit own profile, admins see all');
        console.log('   • Products: Public read, admin write');
        console.log('   • Orders: Users see own orders, admins see all');
        console.log('   • Order Items: Linked to user orders');
        console.log('   • Activity: Users see own activity');
        console.log('   • Payment Settings: Public read enabled settings');
        console.log('   • Contact Messages: Public insert, admin read');
        console.log('   • Support Messages: Users see own, admins see all');

        await sql.end();

    } catch (error) {
        console.error('❌ Error enabling RLS:', error.message);

        if (error.message.includes('already exists')) {
            console.log('ℹ️  Some policies already exist - this is normal');
        } else if (error.message.includes('does not exist')) {
            console.log('ℹ️  Some tables may not exist yet - run your schema migration first');
        } else {
            console.error('Full error:', error);
        }

        process.exit(1);
    }
}

enableRLSForAllTables();