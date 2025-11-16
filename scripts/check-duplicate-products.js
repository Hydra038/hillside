const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkDuplicateProducts() {
  try {
    console.log('Checking for duplicate products...\n');
    
    // Get all products
    const allProducts = await sql`SELECT * FROM products ORDER BY name, created_at`;
    console.log(`Total products found: ${allProducts.length}\n`);
    
    // Group products by name to find duplicates
    const productsByName = {};
    allProducts.forEach(product => {
      const name = product.name.toLowerCase().trim();
      if (!productsByName[name]) {
        productsByName[name] = [];
      }
      productsByName[name].push(product);
    });
    
    // Find duplicates
    const duplicates = [];
    Object.keys(productsByName).forEach(name => {
      if (productsByName[name].length > 1) {
        duplicates.push({
          name: name,
          products: productsByName[name]
        });
      }
    });
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate products found!');
      return;
    }
    
    console.log(`⚠️ Found ${duplicates.length} sets of duplicate products:\n`);
    
    duplicates.forEach((duplicate, index) => {
      console.log(`${index + 1}. "${duplicate.name}" (${duplicate.products.length} duplicates):`);
      duplicate.products.forEach(product => {
        console.log(`   - ID: ${product.id}, Price: £${product.price}, Stock: ${product.stock_quantity}, Created: ${product.created_at}`);
      });
      console.log('');
    });
    
    // Show detailed comparison for first duplicate set
    if (duplicates.length > 0) {
      console.log('Detailed comparison of first duplicate set:');
      const firstDuplicate = duplicates[0];
      console.log(`\nProducts with name: "${firstDuplicate.name}"`);
      firstDuplicate.products.forEach((product, i) => {
        console.log(`\nProduct ${i + 1}:`);
        console.log(`  ID: ${product.id}`);
        console.log(`  Name: ${product.name}`);
        console.log(`  Description: ${product.description}`);
        console.log(`  Price: £${product.price}`);
        console.log(`  Category: ${product.category}`);
        console.log(`  Stock: ${product.stock_quantity}`);
        console.log(`  Image: ${product.image_url || 'None'}`);
        console.log(`  Created: ${product.created_at}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking for duplicates:', error);
  }
}

checkDuplicateProducts();
