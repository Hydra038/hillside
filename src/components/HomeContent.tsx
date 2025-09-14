'use client';

import Link from "next/link";
import type { Product } from "@/types/product";

interface HomeContentProps {
  featuredProducts: Product[];
}

export default function HomeContent({ featuredProducts }: HomeContentProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gray-900 text-white py-20 min-h-[70vh] lg:min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with subtle parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format&q=80')`,
          }}
        ></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-xl leading-tight">
              Premium Quality Firewood 
              <span className="block text-amber-400">Delivered to Your Door</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-shadow max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Sustainable, seasoned firewood for your home and outdoor needs. 
              Perfect for cozy nights and memorable gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">£{Number(product.price).toFixed(2)}</span>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Sustainable Source</h3>
              <p className="text-gray-600">
                All our firewood comes from responsibly managed forests
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Properly seasoned and ready to burn
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to your location
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
