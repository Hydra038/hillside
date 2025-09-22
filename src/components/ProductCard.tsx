'use client'

import Link from 'next/link'
import { type Product } from '@/types/product'
import { useCartStore } from '@/lib/stores/cart-store'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)

  // Check if this is a special offer product
  const isFiveTonneOffer = product.name.toLowerCase().includes('5 tonne') || product.name.toLowerCase().includes('5 tonnes');
  const isSpecialOffer = (
    product.category === 'Special Offers' ||
    product.name.toLowerCase().includes('special offer') ||
    (product.name.toLowerCase().includes('offer') && !isFiveTonneOffer)
  );

  // Provide default value for stockQuantity if undefined
  const stockQuantity = product.stockQuantity ?? 0;

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      // Always fetch the latest product data from the API
      const res = await fetch(`/api/products/${product.id}`);
      if (!res.ok) throw new Error('Failed to fetch latest product data');
      const latest = await res.json();
      const price = typeof latest.price === 'string' ? Number(latest.price) : latest.price;
      addItem({
        id: latest.id,
        name: latest.name,
        price,
        imageUrl: latest.imageUrl || undefined
      });
    } catch (err) {
      alert('Could not add to cart. Please try again.');
      console.error(err);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden relative ${isSpecialOffer ? 'ring-2 ring-red-500 shadow-lg' : ''} ${isFiveTonneOffer ? 'scale-[1.03] border-4 border-yellow-400 animate-bounce-slow' : ''}`}
      tabIndex={0}
      aria-label={`Product card for ${product.name}`}
    >
      {/* Special Offer Badge */}
      {isFiveTonneOffer ? (
        <div className="absolute top-2 right-2 z-20 flex flex-col items-end">
          <span className="text-lg px-4 py-2 bg-yellow-400 text-red-900 border-2 border-red-600 rounded-full font-bold animate-bounce-slow shadow-lg">
            🔥 5 TONNE MEGA DEAL!
          </span>
          <span className="mt-2 bg-yellow-300 text-red-800 px-3 py-1 rounded-full text-xs font-extrabold border border-yellow-500 shadow animate-bounce-slow">
            ONLY £{Number(product.price).toFixed(2)} - SAVE BIG!
          </span>
        </div>
      ) : isSpecialOffer ? (
        <div className="absolute top-2 right-2 z-20 flex flex-col items-end">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
            🔥 SPECIAL OFFER! ONLY £{Number(product.price).toFixed(2)}
          </span>
        </div>
      ) : null}

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name || 'Product image'}
          className={`w-full h-48 object-cover ${isFiveTonneOffer ? 'ring-4 ring-yellow-400 scale-105' : ''}`}
          loading="lazy"
        />
      )}

      <div className="p-4">
        <h3 className={`text-xl font-semibold mb-2 ${isFiveTonneOffer ? 'text-yellow-600 drop-shadow font-extrabold uppercase tracking-wider' : isSpecialOffer ? 'text-red-700' : 'text-gray-900'
          }`}>{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className={`text-lg font-bold ${isFiveTonneOffer ? 'text-yellow-700 text-2xl animate-bounce-slow' : isSpecialOffer ? 'text-red-600 text-xl' : 'text-gray-900'
            }`}>
            £{Number(product.price).toFixed(2)}
          </span>
          {isFiveTonneOffer ? (
            <span className="text-yellow-700 text-base font-extrabold animate-bounce-slow">
              ⭐️ BEST VALUE THIS SEASON ⭐️
            </span>
          ) : isSpecialOffer ? (
            <span className="text-green-600 text-sm font-semibold">
              MASSIVE SAVINGS!
            </span>
          ) : null}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 ${isSpecialOffer
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {/* Shopping cart or loading icon */}
            {isAdding ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l1.5-9M16 13v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H10a2 2 0 00-2 2v4.01" />
              </svg>
            )}
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="flex items-center justify-center gap-2 w-full text-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          tabIndex={0}
          aria-label={`View details for ${product.name}`}
        >
          {/* Eye icon for view details */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </Link>

        {stockQuantity < 10 && stockQuantity > 0 && (
          <p className="text-amber-600 text-sm mt-2">
            Only {product.stockQuantity} left in stock!
          </p>
        )}

        {product.stockQuantity === 0 && (
          <p className="text-red-600 text-sm mt-2">
            Out of stock
          </p>
        )}
      </div>
    </div>
  )
}
