import { supabaseAdmin } from '../src/lib/supabase-admin'

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage bucket for product images...')

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'product-images')

    if (bucketExists) {
      console.log('✓ Bucket "product-images" already exists')
    } else {
      // Create the bucket
      const { data, error } = await supabaseAdmin.storage.createBucket('product-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      })

      if (error) {
        console.error('Error creating bucket:', error)
        return
      }

      console.log('✓ Created bucket "product-images"')
    }

    console.log('\n✅ Storage setup complete!')
    console.log('\nNext steps:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Storage > product-images')
    console.log('3. Make sure the bucket is set to PUBLIC')
    console.log('4. You can now upload product images through the admin panel!')

  } catch (error) {
    console.error('Error setting up storage:', error)
  }
}

setupStorage()
