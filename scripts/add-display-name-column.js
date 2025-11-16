const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function addDisplayNameColumn() {
  try {
    console.log('Connecting to database...');
    
    // First check if column exists
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'payment_settings' AND column_name = 'display_name';
    `;
    
    if (columns.length > 0) {
      console.log('Column display_name already exists in payment_settings table');
      return;
    }
    
    console.log('Adding display_name column to payment_settings table...');
    await sql`
      ALTER TABLE payment_settings ADD COLUMN display_name VARCHAR(100) NOT NULL DEFAULT '';
    `;
    console.log('SUCCESS: display_name column added to payment_settings table!');
    
    // Verify the column was added
    const verifyColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'payment_settings';
    `;
    console.log('Current columns in payment_settings:', verifyColumns.map(c => c.column_name));
    
  } catch (error) {
    console.error('ERROR adding display_name column:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
  }
}

addDisplayNameColumn();
