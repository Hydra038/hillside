'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Thank You for Your Order!</h1>
        {orderId && (
          <div className="mb-6">
            <p className="text-lg text-gray-600 mb-2">Your order has been successfully placed.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600">Order Number:</p>
              <p className="font-mono text-lg font-semibold text-green-800">#{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        )}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-amber-700 text-left space-y-1">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• We'll prepare your order for delivery</li>
              <li>• You'll get tracking information when shipped</li>
              <li>• Delivery typically takes 2-3 business days</li>
            </ul>
          </div>
        </div>
        <div className="space-x-4">
          <Link
            href="/account"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors font-medium"
          >
            View Order History
          </Link>
          <Link
            href="/shop"
            className="inline-block text-amber-600 hover:text-amber-700 px-6 py-3 border border-amber-600 rounded-md hover:bg-amber-50 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="tel:+447878779622" className="text-amber-600 hover:text-amber-700">
              +44 7878 779622
            </a>
            {' '}or{' '}
            <a href="mailto:support@firewoodlogsfuel.com" className="text-amber-600 hover:text-amber-700">
              support@firewoodlogsfuel.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
