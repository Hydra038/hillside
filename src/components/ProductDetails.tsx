'use client'

import { Product } from '@/types/product'
import { useCartStore } from '@/lib/stores/cart-store'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  product: Product
}

export default function ProductDetails({ product }: Props) {
  const { addItem, items } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Check if product is already in cart
  const cartItem = items.find(item => item.id === product.id)
  const isInCart = !!cartItem

  const handleAddToCart = () => {
    setIsAdding(true)
    const price = typeof product.price === 'string' ? Number(product.price) : product.price
    addItem({
      id: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl
    })
    setTimeout(() => {
      setIsAdding(false)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
      <div className="relative w-full aspect-square">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        )}
      </div>
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{product.name}</h1>
        <p className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-amber-700">£{Number(product.price).toFixed(2)}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{product.description}</p>
        <div className="space-y-3 sm:space-y-4">
          {(product.stockQuantity ?? 0) > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full flex items-center justify-center gap-2 py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all text-sm sm:text-base font-medium ${
                isInCart && !isAdding
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-400'
              }`}
            >
              {isAdding ? (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Adding...
                </>
              ) : isInCart ? (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">In Cart ({cartItem?.quantity}) - Add More</span>
                  <span className="sm:hidden">In Cart ({cartItem?.quantity})</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l1.5-9M16 13v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H10a2 2 0 00-2 2v4.01" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg cursor-not-allowed text-sm sm:text-base font-medium"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
