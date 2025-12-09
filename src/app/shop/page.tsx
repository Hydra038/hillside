'use client'

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error loading products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    // Always show special offers first
    const aIsSpecial = a.category === 'Special Offers' || 
                      a.name.toLowerCase().includes('special offer') ||
                      a.name.toLowerCase().includes('offer');
    const bIsSpecial = b.category === 'Special Offers' || 
                      b.name.toLowerCase().includes('special offer') ||
                      b.name.toLowerCase().includes('offer');
    
    if (aIsSpecial && !bIsSpecial) return -1;
    if (!aIsSpecial && bIsSpecial) return 1;

    // Then sort by selected option
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Firewood Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-32 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Firewood Products</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Our Firewood Products</h1>
        
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={{
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price?.toString?.() ?? '',
              imageUrl: product.image_url || undefined,
              category: product.category,
              stockQuantity: product.stock_quantity,
              isFeatured: product.is_featured,
              createdAt: product.created_at
            }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}
