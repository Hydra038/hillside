'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import ProductFilters from '@/components/ProductFilters';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-2xl px-2 py-8 sm:px-4 sm:py-12 md:py-16 lg:max-w-7xl lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-2xl px-2 py-8 sm:px-4 sm:py-12 md:py-16 lg:max-w-7xl lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading products: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

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
