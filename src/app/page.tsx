import HomeContent from '@/components/HomeContent';
import { Suspense } from 'react';
import type { Product } from '@/types/product';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // Get featured products using Supabase client
  let featuredProducts: Product[] = [];
  
  try {
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(3);

    if (error) {
      console.error('Error fetching featured products:', error);
    } else if (dbProducts) {
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