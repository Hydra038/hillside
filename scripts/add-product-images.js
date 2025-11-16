const { neon } = require('@neondatabase/serverless');

async function addProductImages() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Adding images to products...');
    
    // Define images for each product type
    const productImages = {
      'Premium Oak Logs': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
      'Mixed Hardwood Bundle': 'https://images.unsplash.com/photo-1551801841-ecad875a020?w=400&h=300&fit=crop&auto=format',
      'Birch Logs - Small': 'https://images.unsplash.com/photo-1445024441609-ba2eb8650f95?w=400&h=300&fit=crop&auto=format',
      'Ash Logs - Large': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop&auto=format',
      'Kindling Bundle': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format',
      'Beech Logs - Premium': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
      '5 Tonnes Mixed Hardwood - Special Offer': 'https://images.unsplash.com/photo-1550985543-52d8ee9d0c2c?w=400&h=300&fit=crop&auto=format'
    };
    
    // Get all products
    const products = await sql`SELECT * FROM products`;
    
    console.log(`Found ${products.length} products to update:`);
    
    for (const product of products) {
      const imageUrl = productImages[product.name];
      
      if (imageUrl) {
        await sql`
          UPDATE products 
          SET image_url = ${imageUrl}
          WHERE id = ${product.id}
        `;
        
        console.log(`✅ Updated ${product.name} with image: ${imageUrl}`);
      } else {
        console.log(`⚠️ No image found for: ${product.name}`);
      }
    }
    
    console.log('\n🎉 Product images updated successfully!');
    
    // Show updated products
    const updatedProducts = await sql`SELECT name, image_url FROM products ORDER BY id`;
    console.log('\nUpdated products with images:');
    console.log('=====================================');
    
    updatedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Image: ${product.image_url || 'No image'}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

addProductImages();
