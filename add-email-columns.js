const mysql = require('mysql2/promise');

async function addEmailVerificationColumns() {
  let connection;
  
  try {
    console.log('🔗 Connecting to MySQL database...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'hillside', 
      password: 'Derq@038!',
      database: 'firewood'
    });
    
    console.log('✅ Connected to database successfully!');
    
    // First, let's check the current table structure
    console.log('\n📋 Current users table structure:');
    const [currentStructure] = await connection.execute('DESCRIBE users');
    currentStructure.forEach(row => {
      console.log(`  - ${row.Field} (${row.Type})`);
    });
    
    // Check if email verification columns already exist
    const emailVerifiedExists = currentStructure.some(row => row.Field === 'email_verified');
    
    if (emailVerifiedExists) {
      console.log('\n✅ Email verification columns already exist!');
    } else {
      console.log('\n📝 Adding email verification columns...');
      
      try {
        await connection.execute(`
          ALTER TABLE users 
          ADD COLUMN email_verified TINYINT NOT NULL DEFAULT 0,
          ADD COLUMN email_verification_token VARCHAR(255),
          ADD COLUMN email_verification_expires DATETIME
        `);
        
        console.log('✅ Email verification columns added successfully!');
      } catch (alterError) {
        if (alterError.code === 'ER_DUP_FIELDNAME') {
          console.log('✅ Email verification columns already exist!');
        } else {
          throw alterError;
        }
      }
    }
    
    // Show updated table structure
    console.log('\n📋 Updated users table structure:');
    const [updatedStructure] = await connection.execute('DESCRIBE users');
    updatedStructure.forEach(row => {
      const isNew = ['email_verified', 'email_verification_token', 'email_verification_expires'].includes(row.Field);
      const marker = isNew ? '🆕' : '  ';
      console.log(`${marker} ${row.Field} (${row.Type})`);
    });
    
    console.log('\n🎉 Database is ready for email verification!');
    console.log('\n📝 Next steps:');
    console.log('1. Test user signup at http://localhost:3002/signup');
    console.log('2. Check server console for verification email');
    console.log('3. Copy verification link from email output');
    console.log('4. Visit link to verify email');
    console.log('5. Sign in with verified account');
    
  } catch (error) {
    console.error('❌ Error setting up email verification:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Check your database credentials in .env.local');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL server is running');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔐 Database connection closed.');
    }
  }
}

// Run the setup
addEmailVerificationColumns();
