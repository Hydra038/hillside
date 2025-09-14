'use client'

import { Product } from '@/types/product'
import { useCartStore } from '@/lib/stores/cart-store'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  product: Product
}

export default function ProductDetails({ product }: Props) {
  const { addItem } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    const price = typeof product.price === 'string' ? Number(product.price) : product.price
    addItem({
      id: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
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
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl font-semibold mb-4">£{Number(product.price).toFixed(2)}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <div className="space-y-4">
          {(product.stockQuantity ?? 0) > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
