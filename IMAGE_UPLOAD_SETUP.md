# Image Upload Setup Instructions

## Supabase Storage Bucket Setup

To enable image uploads for products, you need to create a storage bucket in Supabase:

### Step 1: Create Storage Bucket

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Yes (check this box)
   - **File size limit**: 5242880 (5MB)
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
6. Click **"Create bucket"**

### Step 2: Set Bucket Policies (if needed)

If images aren't accessible, you may need to add a policy:

1. In the Storage section, click on the `product-images` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Add this policy for public read access:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

6. Add this policy for authenticated uploads (admin only handled by API):

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );
```

### Step 3: Test the Upload

1. Go to your admin dashboard
2. Try adding a new product
3. Click on the image upload area
4. Select an image file (PNG, JPG, or WebP, max 5MB)
5. The image should upload and show a preview
6. Submit the form to create the product with the uploaded image

## Features

✅ Drag and drop or click to upload  
✅ Image preview before saving  
✅ Support for PNG, JPG, and WebP formats  
✅ 5MB file size limit  
✅ Automatic image optimization  
✅ Option to enter URL manually if preferred  
✅ Images stored securely in Supabase Storage  

## Troubleshooting

### Images not uploading?
- Check that the `product-images` bucket exists
- Verify the bucket is set to **Public**
- Check browser console for errors
- Ensure you're logged in as admin

### Images not displaying?
- Check the bucket policies allow public SELECT
- Verify the image URL in the database
- Try accessing the image URL directly in browser

### Upload fails?
- File might be too large (max 5MB)
- File type might not be supported
- Check your Supabase storage quota
