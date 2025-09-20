const { Client } = require('pg');
require('dotenv').config();

async function updateAllImages() {
  const client = new Client(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Updating all product images...');
    
    // Update specific products with proper images
    const updates = [
      // Products with wrong paths - fix the paths
      { oldPath: '/images/mixed-hardwood.jpg', newPath: '/images/products/mixed-hardwood-softwood-logs.webp' },
      { oldPath: '/images/birch-firewood.jpg', newPath: '/images/products/premium-firewood.jpg' },
      { oldPath: '/images/cherry-firewood.jpg', newPath: '/images/products/premium-firewood.jpg' },
      { oldPath: '/images/hickory-firewood.jpg', newPath: '/images/products/premium-firewood.jpg' },
      { oldPath: '/images/bulk-hardwood.jpg', newPath: '/images/products/bulk-hardwood-logs-crate.webp' },
      { oldPath: '/images/aged-oak.jpg', newPath: '/images/products/oak-logs.jpg' },
      { oldPath: '/images/compressed-logs.jpg', newPath: '/images/products/premium-firewood-briquettes.jpg' }
    ];
    
    for (const update of updates) {
      const result = await client.query(
        'UPDATE products SET image_url = $1 WHERE image_url = $2',
        [update.newPath, update.oldPath]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ Updated ${result.rowCount} products: ${update.oldPath} -> ${update.newPath}`);
      }
    }
    
    console.log('✅ All images updated!');
    
    // Show final results
    const result = await client.query('SELECT id, name, image_url FROM products WHERE image_url NOT LIKE \'/images/products/%\' ORDER BY id');
    
    if (result.rows.length > 0) {
      console.log('\n⚠️  Products still with incorrect image paths:');
      result.rows.forEach(product => {
        console.log(`${product.id}. ${product.name} -> ${product.image_url}`);
      });
    } else {
      console.log('\n✅ All products now have correct image paths!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

updateAllImages();