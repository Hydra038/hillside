const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Placeholder images from Unsplash (free to use)
const placeholderImages = {
  'kiln-dried-hardwood-logs.webp': 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800',
  'mixed-hardwood-softwood-logs.webp': 'https://images.unsplash.com/photo-1605527075245-e6c5e80da6ac?w=800',
  'seasoned-softwood-logs.webp': 'https://images.unsplash.com/photo-1605527075452-4c7598f88dce?w=800',
  'kindling-wood.png': 'https://images.unsplash.com/photo-1542320868-b85f8d73e13f?w=800',
  'bulk-hardwood-logs-crate.webp': 'https://images.unsplash.com/photo-1605527075601-7b5bb89c7d74?w=800',
  'premium-firewood-briquettes.jpg': 'https://images.unsplash.com/photo-1605527075321-7a0be09f70e9?w=800',
  'firelighters.webp': 'https://images.unsplash.com/photo-1542320868-f1c4533a2f3d?w=800',
  'smokeless-coal.webp': 'https://images.unsplash.com/photo-1605527074826-47e72d8aec8b?w=800',
  'wood-pellets.jpg': 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800',
  'premium-firewood-box.avif': 'https://images.unsplash.com/photo-1605527075245-e6c5e80da6ac?w=800',
  '5-tonne-offer.webp': 'https://images.unsplash.com/photo-1605527075601-7b5bb89c7d74?w=800',
  'premium-firewood.jpg': 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800',
};

async function updateImageUrls() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('Updating product image URLs to use Unsplash placeholders...\n');
    
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, image_url');
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }
    
    for (const product of products) {
      const filename = product.image_url?.split('/').pop();
      const newUrl = placeholderImages[filename] || 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800';
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: newUrl })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`Error updating ${product.name}:`, updateError);
      } else {
        console.log(`✅ Updated: ${product.name}`);
        console.log(`   New URL: ${newUrl}\n`);
      }
    }
    
    console.log('✅ All images updated!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateImageUrls();
