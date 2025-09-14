const { neon } = require('@neondatabase/serverless');

async function checkProducts() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Connecting to database...');
    
    // Check if products table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    
    console.log('Products table exists:', tableExists[0].exists);
    
    if (!tableExists[0].exists) {
      console.log('❌ Products table does not exist!');
      return;
    }
    
    // Get all products
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    
    console.log(`✅ Found ${products.length} products:`);
    console.log('=====================================');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: £${product.price}`);
      console.log(`   Description: ${product.description?.substring(0, 100)}${product.description?.length > 100 ? '...' : ''}`);
      console.log(`   Stock: ${product.stock_quantity}`);
      console.log(`   Weight: ${product.weight}kg`);
      console.log(`   Category: ${product.category}`);
      console.log(`   ID: ${product.id}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProducts();
