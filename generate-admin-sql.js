require('dotenv').config();
const bcrypt = require('bcryptjs');

async function createAdminSQL() {
    try {
        console.log('🔐 Generating hardcoded admin credentials...\n');

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

        console.log('\n📝 SQL COMMAND TO CREATE ADMIN USER:');
        console.log('====================================');

        const sqlCommand = `
INSERT INTO users (id, name, email, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin_${Date.now()}',
  '${adminName}',
  '${adminEmail}',
  '${hashedPassword}',
  'ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  password = EXCLUDED.password,
  role = 'ADMIN',
  "emailVerified" = true,
  "updatedAt" = NOW();
`;

        console.log(sqlCommand);

        console.log('\n🌐 LOGIN INFORMATION:');
        console.log('=====================');
        console.log('Local Login URL: http://localhost:3001/admin/signin');
        console.log('Production Login URL: https://firewood-ecommerce.vercel.app/admin/signin');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        console.log('\n✅ Next Steps:');
        console.log('1. Copy the SQL command above');
        console.log('2. Run it in your Supabase SQL editor');
        console.log('3. The admin user will be created/updated');
        console.log('4. Login using the credentials above');

    } catch (error) {
        console.error('Error generating admin credentials:', error);
    }
}

createAdminSQL();