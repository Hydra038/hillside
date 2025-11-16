const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkProductImages() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('Checking product images...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, image_url, images')
      .order('id');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log(`\n✅ Found ${products.length} products:`);
    console.log('=====================================');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   image_url: ${product.image_url || 'No image set'}`);
      console.log(`   images: ${product.images || 'No images array'}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductImages();
