require('dotenv').config();
const { Client } = require('pg');

async function checkConstraints() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('🔍 Checking users table constraints...\n');

        // Check for unique constraints
        const constraints = await client.query(`
      SELECT 
        tc.constraint_name, 
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'users' 
        AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY');
    `);

        console.log('📋 CONSTRAINTS ON USERS TABLE:');
        console.log('===============================');
        if (constraints.rows.length > 0) {
            constraints.rows.forEach(row => {
                console.log(`${row.constraint_type}: ${row.column_name} (${row.constraint_name})`);
            });
        } else {
            console.log('No unique constraints found');
        }

        // Check if admin user already exists
        console.log('\n🔍 Checking for existing admin user...');
        const existingUser = await client.query(`
      SELECT id, email, role 
      FROM users 
      WHERE email = 'support@firewoodlogsfuel.com'
    `);

        if (existingUser.rows.length > 0) {
            console.log('⚠️  Admin user already exists:');
            console.log(existingUser.rows[0]);
        } else {
            console.log('✅ No existing admin user found - safe to insert');
        }

    } catch (error) {
        console.error('Error checking constraints:', error.message);
    } finally {
        await client.end();
    }
}

checkConstraints();