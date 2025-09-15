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

  // Enhanced product descriptions based on product name and type
  const getEnhancedDescription = () => {
    const name = product.name.toLowerCase()
    
    if (name.includes('5 tonne') || name.includes('bulk')) {
      return {
        extended: "This exceptional bulk firewood offer provides you with a substantial 5-tonne supply of premium seasoned logs, perfect for heating large homes, commercial properties, or for customers who want to stock up for the entire winter season. Our bulk quantities offer significant savings while ensuring you never run out of quality firewood when you need it most.",
        specifications: {
          weight: "5000kg (5 Tonnes)",
          volume: "Approximately 7-8 cubic meters",
          burnTime: "120-150 hours total burn time",
          heatOutput: "High - 4.5-5.0 kWh/kg",
          moistureContent: "Below 20% (kiln dried)",
          seasoning: "Minimum 2 years naturally seasoned"
        },
        features: [
          "Massive 5-tonne quantity - perfect for whole winter heating",
          "Premium mixed hardwood species for optimal heat output",
          "Kiln dried to below 20% moisture content",
          "Ready to burn immediately upon delivery",
          "Sustainably sourced from managed UK forests",
          "Free delivery within 25 miles of our depot",
          "Logs cut to standard 25cm lengths for most stoves",
          "Bulk pricing offers exceptional value per tonne"
        ]
      }
    }
    
    // Default enhanced content for other products
    return {
      extended: "Premium seasoned firewood logs, carefully selected and prepared for optimal burning performance. Our logs are sourced from sustainable UK forests and processed to the highest standards to ensure clean, efficient burning with maximum heat output for your home heating needs.",
      specifications: {
        weight: "Standard weight",
        volume: "Standard cord measurements",
        burnTime: "6-8 hours per load",
        heatOutput: "4.0-4.5 kWh/kg",
        moistureContent: "Below 20%",
        seasoning: "18-24 months seasoned"
      },
      features: [
        "Premium hardwood species for long burn times",
        "Kiln dried for immediate use",
        "Clean burning with minimal ash residue",
        "Sustainably sourced from managed forests",
        "Cut to standard stove sizes",
        "Free local delivery available"
      ]
    }
  }

  const enhanced = getEnhancedDescription()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                console.log('Image failed to load:', product.imageUrl);
                // Fallback to placeholder
                e.currentTarget.src = '/api/placeholder/600/600';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-amber-600 font-medium">{product.name}</p>
                <p className="text-amber-500 text-sm">Product Image</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <p className="text-3xl font-bold text-amber-600">£{Number(product.price).toFixed(2)}</p>
              {product.stockQuantity && product.stockQuantity > 0 && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  In Stock ({product.stockQuantity} available)
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-amber-600 text-white py-4 px-6 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400 font-semibold text-lg shadow-lg"
            >
              {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Local Delivery
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ready to Burn
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
          <svg className="w-6 h-6 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Product Details
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">{enhanced.extended}</p>
      </div>

      {/* Specifications and Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Specifications */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
            <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Specifications
          </h3>
          <div className="space-y-3">
            {Object.entries(enhanced.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-gray-900 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Key Features
          </h3>
          <ul className="space-y-3">
            {enhanced.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Delivery & Storage Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Delivery Details:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Free delivery within 25 miles</li>
              <li>• Delivery charges apply beyond 25 miles</li>
              <li>• 1-3 working days delivery time</li>
              <li>• Contactless delivery available</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Storage Tips:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Store in a dry, well-ventilated area</li>
              <li>• Keep off direct ground contact</li>
              <li>• Cover with tarpaulin if stored outside</li>
              <li>• Allow air circulation around logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
