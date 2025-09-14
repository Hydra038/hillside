const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkDatabaseTables() {
  try {
    console.log('Checking available tables in the database...\n');
    
    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('Available tables:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    console.log('\nChecking if there are any product-related tables...');
    
    // Try different possible table names
    const possibleNames = ['products', 'product', 'items', 'firewood_products'];
    
    for (const tableName of possibleNames) {
      try {
        const result = await sql`SELECT COUNT(*) as count FROM ${sql(tableName)}`;
        console.log(`✅ Found table: ${tableName} with ${result[0].count} records`);
        
        // Show sample data
        const sample = await sql`SELECT * FROM ${sql(tableName)} LIMIT 3`;
        console.log('Sample data:');
        sample.forEach((item, i) => {
          console.log(`  ${i + 1}. ID: ${item.id}, Name: ${item.name || 'N/A'}`);
        });
      } catch (error) {
        // Table doesn't exist, continue
      }
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabaseTables();
