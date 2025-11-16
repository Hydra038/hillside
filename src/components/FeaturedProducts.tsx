'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { Product } from '@/types/product'

// Database product type with null values from Supabase
interface DbProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string | null;
  stockQuantity: number;
  weight: string | null;
  dimensions: { length: number; width: number; height: number; } | null;
  moisture: string | null;
  season: string | null;
  features: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        // Show first 3 products as featured and convert null to undefined for imageUrl
        const mappedProducts = data.slice(0, 3).map((p: DbProduct) => ({
          ...p,
          imageUrl: p.imageUrl ?? undefined
        }))
        setProducts(mappedProducts)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />
            <Link
              href={`/products/${product.id}`}
              className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
