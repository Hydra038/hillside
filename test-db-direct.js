// Simplified connection test
require('dotenv').config({ path: '.env.local' });

console.log('🔧 Database Connection Diagnostics\n');

console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'Set (hidden for security)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Try to parse the DATABASE_URL
if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        console.log('\nParsed DATABASE_URL:');
        console.log('Protocol:', url.protocol);
        console.log('Host:', url.hostname);
        console.log('Port:', url.port);
        console.log('Database:', url.pathname);
        console.log('Search params:', url.search);
    } catch (error) {
        console.log('❌ Error parsing DATABASE_URL:', error.message);
    }
}

// Try basic connection without Prisma
const { Client } = require('pg');

async function testDirectConnection() {
    console.log('\n🔍 Testing direct PostgreSQL connection...');

    const client = new Client({
        connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('✅ Direct PostgreSQL connection successful');

        const result = await client.query('SELECT NOW()');
        console.log('✅ Query test successful:', result.rows[0]);

        // Test if our tables exist
        const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('contact_messages', 'orders', 'users')
    `);
        console.log('✅ Found tables:', tableCheck.rows.map(row => row.table_name));

    } catch (error) {
        console.log('❌ Direct connection failed:', error.message);
    } finally {
        await client.end();
    }
}

testDirectConnection();