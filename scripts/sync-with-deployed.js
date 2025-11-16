const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// If your deployed site uses these URLs, update them here
const workingImageUrls = {
  'Premium Oak Firewood': 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800',
  'Mixed Hardwood Bundle': 'https://images.unsplash.com/photo-1605527075245-e6c5e80da6ac?w=800',
  'Birch Firewood': 'https://images.unsplash.com/photo-1605527075452-4c7598f88dce?w=800',
  'British Pine Kindling - Net Bag': 'https://images.unsplash.com/photo-1542320868-b85f8d73e13f?w=800',
  'Mixed Hardwood Logs - Dumpy Bag (1.2m³)': 'https://images.unsplash.com/photo-1605527075601-7b5bb89c7d74?w=800',
  'Compressed Fire Logs': 'https://images.unsplash.com/photo-1605527075321-7a0be09f70e9?w=800',
  'Natural Firelighters': 'https://images.unsplash.com/photo-1542320868-f1c4533a2f3d?w=800',
  'Smokeless Coal - Approved Fuel': 'https://images.unsplash.com/photo-1605527074826-47e72d8aec8b?w=800',
  'Premium Wood Pellets - 15kg Bag': 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800',
  'Premium Firewood Gift Box': 'https://images.unsplash.com/photo-1605527075245-e6c5e80da6ac?w=800',
  '5 Tonne Bulk Firewood Deal': 'https://images.unsplash.com/photo-1605527075601-7b5bb89c7d74?w=800',
  'Premium Mixed Logs - Large Bag': 'https://images.unsplash.com/photo-1605527075207-1523f6e79025?w=800',
};

async function updateToWorkingUrls() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('Updating image URLs to match deployed site...\n');
    
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, image_url');
    
    if (fetchError) {
      console.error('Error:', fetchError);
      return;
    }
    
    for (const product of products) {
      const newUrl = workingImageUrls[product.name];
      
      if (newUrl) {
        const { error } = await supabase
          .from('products')
          .update({ image_url: newUrl })
          .eq('id', product.id);
        
        if (error) {
          console.error(`❌ Error updating ${product.name}:`, error);
        } else {
          console.log(`✅ Updated: ${product.name}`);
        }
      } else {
        console.log(`⚠️  No URL mapping for: ${product.name}`);
      }
    }
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateToWorkingUrls();
