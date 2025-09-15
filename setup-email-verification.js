const mysql = require('mysql2/promise');

async function setupEmailVerification() {
  try {
    console.log('🔗 Connecting to database...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'hillside',
      password: 'Derq@038!',
      database: 'firewood'
    });
    
    console.log('✅ Connected successfully');
    
    console.log('📝 Adding email verification columns...');
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN email_verified TINYINT NOT NULL DEFAULT 0,
        ADD COLUMN email_verification_token VARCHAR(255),
        ADD COLUMN email_verification_expires DATETIME
      `);
      console.log('✅ Email verification columns added successfully');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Email verification columns already exist');
      } else {
        throw error;
      }
    }
    
    console.log('📋 Current user table structure:');
    const [rows] = await connection.execute('DESCRIBE users');
    rows.forEach(row => {
      console.log(`  - ${row.Field} (${row.Type})`);
    });
    
    await connection.end();
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupEmailVerification();
