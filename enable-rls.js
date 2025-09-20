const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Fallback to hardcoded URL if not loaded from env
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:Derq@038!@db.fyjmczdbllubrssixpnx.supabase.co:5432/postgres';

console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No');
console.log('Using DATABASE_URL:', DATABASE_URL ? 'Yes' : 'No');

async function enableRLS() {
    try {
        console.log('Connecting to database...');
        const sql = postgres(DATABASE_URL);

        console.log('Enabling Row Level Security for contact_messages table...');

        // Enable RLS
        await sql`ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;`;
        console.log('✓ RLS enabled for contact_messages table');

        // Create policy for public inserts (contact forms)
        await sql`
      CREATE POLICY "Allow public inserts on contact_messages" 
      ON contact_messages FOR INSERT 
      WITH CHECK (true);
    `;
        console.log('✓ Public insert policy created');

        // Create policy for authenticated users to read (admin access)
        await sql`
      CREATE POLICY "Allow authenticated users to read contact_messages" 
      ON contact_messages FOR SELECT 
      USING (auth.role() = 'authenticated');
    `;
        console.log('✓ Admin read policy created');

        await sql.end();
        console.log('✓ All RLS policies configured successfully!');

    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('RLS policies already exist - no changes needed');
        } else {
            console.error('Error:', error);
            console.error('Full error details:', JSON.stringify(error, null, 2));
        }
        process.exit(1);
    }
}

enableRLS();