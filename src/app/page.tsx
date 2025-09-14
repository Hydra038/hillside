import HomeContent from '@/components/HomeContent';
import { Suspense } from 'react';
import type { Product } from '@/types/product';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products/featured`, { cache: 'no-store' })
  const featuredProducts: Product[] = await res.json()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent featuredProducts={featuredProducts} />
    </Suspense>
  );
}