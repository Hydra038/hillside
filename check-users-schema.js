require('dotenv').config();
const { Client } = require('pg');

async function checkUsersSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('🔍 Checking users table schema...\n');

        // Get the actual column structure of the users table
        const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

        console.log('📋 USERS TABLE COLUMNS:');
        console.log('========================');
        result.rows.forEach(row => {
            console.log(`${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        console.log('\n📝 SAMPLE INSERT STRUCTURE:');
        console.log('============================');
        const columns = result.rows.map(row => row.column_name);
        console.log(`Available columns: ${columns.join(', ')}`);

    } catch (error) {
        console.error('Error checking schema:', error.message);
    } finally {
        await client.end();
    }
}

checkUsersSchema();