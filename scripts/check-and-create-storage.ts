import { supabaseAdmin } from '../src/lib/supabase-admin'

async function checkAndCreateStorage() {
  try {
    console.log('Checking Supabase Storage configuration...\n')

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    console.log('📦 Existing buckets:', buckets?.map(b => b.name).join(', ') || 'none')

    const productImagesBucket = buckets?.find(b => b.name === 'product-images')

    if (productImagesBucket) {
      console.log('✅ Bucket "product-images" already exists!')
      console.log('   Public:', productImagesBucket.public)
      console.log('   ID:', productImagesBucket.id)
    } else {
      console.log('\n⚠️  Bucket "product-images" does not exist. Creating it...\n')
      
      // Create the bucket
      const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('product-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      })

      if (createError) {
        console.error('❌ Error creating bucket:', createError)
        console.log('\n📝 Please create the bucket manually in Supabase Dashboard:')
        console.log('   1. Go to Storage in Supabase Dashboard')
        console.log('   2. Click "New bucket"')
        console.log('   3. Name: product-images')
        console.log('   4. Make it Public: ✓')
        console.log('   5. File size limit: 5MB')
        console.log('   6. Allowed MIME types: image/jpeg, image/png, image/webp')
        return
      }

      console.log('✅ Bucket "product-images" created successfully!')
      console.log('   Bucket data:', newBucket)
    }

    // Test upload
    console.log('\n🧪 Testing upload...')
    const testContent = Buffer.from('test')
    const testPath = `test-${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(testPath, testContent, {
        contentType: 'text/plain'
      })

    if (uploadError) {
      console.error('❌ Test upload failed:', uploadError)
    } else {
      console.log('✅ Test upload successful!')
      
      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(testPath)
      
      console.log('   Public URL:', publicUrl)
      
      // Clean up test file
      await supabaseAdmin.storage
        .from('product-images')
        .remove([testPath])
      
      console.log('   Test file cleaned up')
    }

    console.log('\n✅ Storage is ready for image uploads!')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkAndCreateStorage()
