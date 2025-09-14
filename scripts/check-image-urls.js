const { neon } = require('@neondatabase/serverless');

async function checkProductImages() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Checking product images...');
    
    const products = await sql`SELECT name, image_url FROM products ORDER BY id`;
    
    console.log(`\n✅ Found ${products.length} products:`);
    console.log('=====================================');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Image: ${product.image_url || 'No image set'}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductImages();
