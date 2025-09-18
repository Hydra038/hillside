import HomeContent from '@/components/HomeContent';
import { Suspense } from 'react';
import type { Product } from '@/types/product';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  let featuredProducts: Product[] = [];
  
  try {
    // Fetch featured products directly from database using Prisma
    const dbProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        stockQuantity: true,
        isFeatured: true,
        createdAt: true
      }
    });
    
    featuredProducts = dbProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || undefined,
      category: product.category || undefined,
      stockQuantity: product.stockQuantity || 0,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    featuredProducts = [];
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent featuredProducts={featuredProducts} />
    </Suspense>
  );
}