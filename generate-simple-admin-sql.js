require('dotenv').config();
const bcrypt = require('bcryptjs');

async function createSimpleAdminSQL() {
    try {
        console.log('🔐 Generating SIMPLE admin insert command...\n');

        const adminEmail = 'support@firewoodlogsfuel.com';
        const adminPassword = 'Derq@038!';
        const adminName = 'Support Admin';

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        console.log('📋 ADMIN CREDENTIALS GENERATED:');
        console.log('==============================');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`Hashed Password: ${hashedPassword}`);
        console.log(`Role: ADMIN`);

        console.log('\n📝 SIMPLE SQL COMMAND (NO CONFLICT HANDLING):');
        console.log('==============================================');

        const sqlCommand = `
INSERT INTO users (id, name, email, password, role, "emailVerified", created_at, updated_at)
VALUES (
  'admin_${Date.now()}',
  '${adminName}',
  '${adminEmail}',
  '${hashedPassword}',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
`;

        console.log(sqlCommand);

        console.log('\n📝 ALTERNATIVE: DELETE FIRST, THEN INSERT:');
        console.log('==========================================');

        const deleteAndInsert = `
-- First delete any existing user with this email
DELETE FROM users WHERE email = '${adminEmail}';

-- Then insert the new admin user
INSERT INTO users (id, name, email, password, role, "emailVerified", created_at, updated_at)
VALUES (
  'admin_${Date.now()}',
  '${adminName}',
  '${adminEmail}',
  '${hashedPassword}',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
`;

        console.log(deleteAndInsert);

        console.log('\n🌐 LOGIN INFORMATION:');
        console.log('=====================');
        console.log('Local Login URL: http://localhost:3001/admin/signin');
        console.log('Production Login URL: https://firewood-ecommerce.vercel.app/admin/signin');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        console.log('\n✅ INSTRUCTIONS:');
        console.log('================');
        console.log('1. Since no admin user exists, use the SIMPLE SQL above');
        console.log('2. If you get a duplicate error, use the DELETE+INSERT version');
        console.log('3. Run it in your Supabase SQL editor');
        console.log('4. Login using the credentials above');

    } catch (error) {
        console.error('Error generating admin credentials:', error);
    }
}

createSimpleAdminSQL();