const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function fixMixedHardwoodDuplicates() {
  try {
    console.log('Looking for Mixed Hardwood duplicate products...\n');
    
    // Find all products with "mixed hardwood" in the name (case insensitive)
    const mixedHardwoodProducts = await sql`
      SELECT * FROM products 
      WHERE LOWER(name) LIKE '%mixed hardwood%' 
      ORDER BY created_at ASC
    `;
    
    console.log(`Found ${mixedHardwoodProducts.length} Mixed Hardwood products:\n`);
    
    mixedHardwoodProducts.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}`);
      console.log(`   Name: ${product.name}`);
      console.log(`   Price: £${product.price}`);
      console.log(`   Description: ${product.description.substring(0, 100)}...`);
      console.log(`   Stock: ${product.stock_quantity}`);
      console.log(`   Created: ${product.created_at}`);
      console.log('');
    });
    
    if (mixedHardwoodProducts.length <= 1) {
      console.log('✅ No duplicates found!');
      return;
    }
    
    // Ask which one to keep (keep the first/oldest one by default, remove others)
    console.log('🔧 Fixing duplicates...');
    console.log(`Keeping the first product (ID: ${mixedHardwoodProducts[0].id}) - oldest entry`);
    console.log('Removing the duplicate(s)...\n');
    
    // Remove duplicates (keep the first one, remove the rest)
    for (let i = 1; i < mixedHardwoodProducts.length; i++) {
      const productToRemove = mixedHardwoodProducts[i];
      console.log(`Removing duplicate product: ID ${productToRemove.id} - "${productToRemove.name}"`);
      
      await sql`DELETE FROM products WHERE id = ${productToRemove.id}`;
    }
    
    console.log('\n✅ Duplicate Mixed Hardwood products have been removed!');
    console.log(`Kept product: ID ${mixedHardwoodProducts[0].id} - "${mixedHardwoodProducts[0].name}"`);
    
    // Show the remaining product details
    console.log('\nRemaining Mixed Hardwood product details:');
    const remaining = mixedHardwoodProducts[0];
    console.log(`  Name: ${remaining.name}`);
    console.log(`  Price: £${remaining.price}`);
    console.log(`  Description: ${remaining.description}`);
    console.log(`  Stock: ${remaining.stock_quantity}`);
    
  } catch (error) {
    console.error('Error fixing duplicates:', error);
  }
}

fixMixedHardwoodDuplicates();
