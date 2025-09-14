const fs = require('fs');
const path = require('path');

const content = `import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import HomeContent from '@/components/HomeContent';
import { Suspense } from 'react';
import type { Product } from '@/types/product';

export default async function Home() {
  const dbProducts = await db.select().from(products).limit(3);
  
  const featuredProducts: Product[] = dbProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    image: product.imageUrl || undefined,
    inStock: product.stockQuantity > 0,
    isFeatured: true,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent featuredProducts={featuredProducts} />
    </Suspense>
  );
}`;

fs.writeFileSync(path.join(__dirname, 'src', 'app', 'page.tsx'), content, 'utf8');
