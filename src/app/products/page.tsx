'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import ProductFilters from '@/components/ProductFilters';

// Sample products data (will be replaced with API call)
const products: Product[] = [
  {
    id: 1,
    name: 'Premium Hardwood Logs',
    description: 'High-quality, seasoned hardwood logs perfect for long-lasting heat.',
    price: '120.00',
    category: 'hardwood',
    imageUrl: '/images/products/hardwood-logs.jpg',
    stockQuantity: 100,
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Softwood Kindling',
    description: 'Dry, easy-to-light kindling perfect for starting your fire.',
    price: '45.00',
    category: 'kindling',
    imageUrl: '/images/products/kindling.jpg',
    stockQuantity: 150,
    isFeatured: false,
    createdAt: new Date(),
  },
  // Add more products here
];

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  return (
    <main className="bg-white min-h-screen">
      <ProductFilters products={products} setFilteredProducts={setFilteredProducts} />

      <section className="mx-auto max-w-2xl px-2 py-8 sm:px-4 sm:py-12 md:py-16 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">Products</h2>

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
              tabIndex={0}
              aria-label={`View details for ${product.name}`}
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={product.imageUrl || '/images/products/placeholder.jpg'}
                  alt={product.name || 'Product image'}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                  priority={true}
                />
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 group-hover:text-amber-700 transition-colors duration-200">{product.name}</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">£{Number(product.price).toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
