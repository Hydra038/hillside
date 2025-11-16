const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkSupabaseStorage() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('Checking Supabase Storage for images...\n');
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available storage buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    // Check for common bucket names
    const productBuckets = buckets.filter(b => 
      b.name.includes('product') || 
      b.name.includes('image') || 
      b.name.includes('public')
    );
    
    if (productBuckets.length > 0) {
      console.log('\n📁 Found potential product image buckets:\n');
      
      for (const bucket of productBuckets) {
        console.log(`Bucket: ${bucket.name}`);
        
        const { data: files, error: filesError } = await supabase
          .storage
          .from(bucket.name)
          .list('', { limit: 10 });
        
        if (!filesError && files) {
          console.log(`  Files (${files.length} shown):`);
          files.forEach(file => {
            console.log(`  - ${file.name}`);
          });
        }
        console.log('');
      }
    } else {
      console.log('\n⚠️  No product/image buckets found in Supabase Storage.');
      console.log('Images might be stored elsewhere or in a different bucket.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSupabaseStorage();
