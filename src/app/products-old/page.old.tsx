'use client';

import { useState } from 'react';
import export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  return (
    <div className="bg-white">
      <ProductFilters products={products} setFilteredProducts={setFilteredProducts} />
      
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">{ct } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import ProductFilters from '@/components/ProductFilters';

// Sample products data (will be replaced with API call)
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Hardwood Logs',
    description: 'High-quality, seasoned hardwood logs perfect for long-lasting heat.',
    price: 120,
    category: 'hardwood',
    imageUrl: '/images/products/hardwood-logs.jpg',
    stockQuantity: 100,
    weight: 25,
    dimensions: {
      length: 25,
      width: 10,
      height: 10,
    },
    moisture: 20,
    season: 'all',
    features: [
      'Long burning time',
      'High heat output',
      'Low moisture content',
      'Minimal smoke',
    ],
  },
  {
    id: '2',
    name: 'Softwood Kindling',
    description: 'Dry, easy-to-light kindling perfect for starting your fire.',
    price: 45,
    category: 'kindling',
    imageUrl: '/images/products/kindling.jpg',
    stockQuantity: 150,
    weight: 10,
    dimensions: {
      length: 15,
      width: 2,
      height: 2,
    },
    moisture: 15,
    season: 'all',
    features: [
      'Easy to light',
      'Quick burning',
      'Perfect for starting fires',
      'Conveniently sized',
    ],
  },
  // Add more products here
];

export default function ProductsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">£{product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
