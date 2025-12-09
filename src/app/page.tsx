import HomeContent from '@/components/HomeContent';
import { Suspense } from 'react';
import type { Product } from '@/types/product';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Get featured products using Supabase admin client
  let featuredProducts: Product[] = [];
  
  try {
    const { data: dbProducts, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(3);

    if (error) {
      console.error('Error fetching featured products:', error);
    } else if (dbProducts && dbProducts.length > 0) {
      featuredProducts = dbProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price?.toString?.() ?? '',
        imageUrl: product.image_url || undefined,
        inStock: product.stock_quantity > 0,
        category: product.category,
        isFeatured: product.is_featured,
        createdAt: product.created_at
      }));
    } else {
      // Fallback: Get latest 3 products if no featured products
      const { data: latestProducts } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (latestProducts) {
        featuredProducts = latestProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price?.toString?.() ?? '',
          imageUrl: product.image_url || undefined,
          inStock: product.stock_quantity > 0,
          category: product.category,
          isFeatured: product.is_featured,
          createdAt: product.created_at
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent featuredProducts={featuredProducts} />
    </Suspense>
  );
}