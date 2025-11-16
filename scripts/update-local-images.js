const { neon } = require('@neondatabase/serverless');

async function updateProductImagesLocal() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Updating products with local image paths...');
    
    // Define local image paths for each product
    const localImages = {
      'Premium Oak Logs': '/images/products/oak-logs.jpg',
      'Mixed Hardwood Bundle': '/images/products/mixed-hardwood.jpg',
      'Birch Logs - Small': '/images/products/birch-logs.jpg',
      'Ash Logs - Large': '/images/products/ash-logs.jpg',
      'Kindling Bundle': '/images/products/kindling-bundle.jpg',
      'Beech Logs - Premium': '/images/products/beech-logs.jpg',
      '5 Tonnes Mixed Hardwood - Special Offer': '/images/products/special-offer-5-tonnes.jpg'
    };
    
    // Get all products
    const products = await sql`SELECT * FROM products`;
    
    console.log(`Found ${products.length} products to update:`);
    
    for (const product of products) {
      const localImagePath = localImages[product.name];
      
      if (localImagePath) {
        await sql`
          UPDATE products 
          SET image_url = ${localImagePath}
          WHERE id = ${product.id}
        `;
        
        console.log(`✅ Updated ${product.name} with local image: ${localImagePath}`);
      } else {
        console.log(`⚠️ No local image defined for: ${product.name}`);
      }
    }
    
    console.log('\n🎉 Product images updated to use local paths!');
    
    // Show updated products
    const updatedProducts = await sql`SELECT name, image_url FROM products ORDER BY id`;
    console.log('\nUpdated products with local image paths:');
    console.log('=====================================');
    
    updatedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Image: ${product.image_url || 'No image'}`);
      console.log('   ---');
    });
    
    console.log('\n📁 Place your images in the following locations:');
    console.log('=====================================');
    Object.entries(localImages).forEach(([productName, imagePath]) => {
      console.log(`${productName}:`);
      console.log(`   File: public${imagePath}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

updateProductImagesLocal();
