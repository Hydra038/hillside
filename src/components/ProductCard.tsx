'use client'

import Link from 'next/link'
import { type Product } from '@/types/product'
import { useCartStore } from '@/lib/stores/cart-store'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  
  // Check if product is already in cart
  const cartItem = items.find(item => item.id === product.id)
  const isInCart = !!cartItem
  
  // Check if this is a special offer product
  const isSpecialOffer = product.category === 'Special Offers' || 
                        product.name.toLowerCase().includes('special offer') ||
                        product.name.toLowerCase().includes('offer');

  // Provide default value for stockQuantity if undefined
  const stockQuantity = product.stockQuantity ?? 0;

  const handleAddToCart = () => {
    setIsAdding(true)
    const price = typeof product.price === 'string' ? Number(product.price) : product.price
    addItem({
      id: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl || undefined
    })
    setTimeout(() => {
      setIsAdding(false)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    }, 500)
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
      isSpecialOffer ? 'ring-2 ring-red-500 shadow-lg' : ''
    }`}>
      {/* Special Offer Badge */}
      {isSpecialOffer && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            🔥 SPECIAL OFFER!
          </span>
        </div>
      )}
      
      {product.imageUrl && (
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <h3 className={`text-xl font-semibold mb-2 ${
          isSpecialOffer ? 'text-red-700' : 'text-gray-900'
        }`}>{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`text-lg font-bold ${
            isSpecialOffer ? 'text-red-600 text-xl' : 'text-gray-900'
          }`}>£{Number(product.price).toFixed(2)}</span>
          {isSpecialOffer && (
            <span className="text-green-600 text-sm font-semibold">
              MASSIVE SAVINGS!
            </span>
          )}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all disabled:cursor-not-allowed ${
              isInCart && !isAdding
                ? 'bg-green-600 text-white hover:bg-green-700'
                : isSpecialOffer 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
            } ${isAdding ? 'opacity-100' : 'disabled:opacity-50'}`}
          >
            {/* Shopping cart or loading icon */}
            {isAdding ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : isInCart ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l1.5-9M16 13v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H10a2 2 0 00-2 2v4.01" />
              </svg>
            )}
            {isAdding ? 'Adding...' : isInCart ? `In Cart (${cartItem?.quantity})` : 'Add to Cart'}
          </button>
        </div>

        <Link 
          href={`/products/${product.id}`}
          className="flex items-center justify-center gap-2 w-full text-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
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
