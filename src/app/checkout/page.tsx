'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-provider'
import { useCartStore } from '@/lib/stores/cart-store'

interface PaymentMethod {
  id: number
  name: string
  description?: string
  enabled: boolean
  sortOrder?: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, total, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: {
      street: '',
      city: '',
      postcode: '',
      country: 'United Kingdom'
    }
  })

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const res = await fetch('/api/payment-methods')
        const data = await res.json()
        
        // Check if data is an array
        if (Array.isArray(data) && data.length > 0) {
          setPaymentMethods(data)
          console.log('Payment methods loaded:', data)
        } else {
          console.warn('No payment methods configured')
          setPaymentMethods([])
        }
      } catch (err) {
        console.error('Failed to fetch payment methods', err)
        setPaymentMethods([])
      }
    }
    fetchPaymentMethods()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] || {}) as Record<string, string>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Full name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }
      if (!formData.address.street.trim()) {
        throw new Error('Street address is required')
      }
      if (!formData.address.city.trim()) {
        throw new Error('City is required')
      }
      if (!formData.address.postcode.trim()) {
        throw new Error('Postal code is required')
      }
      if (!formData.address.country.trim()) {
        throw new Error('Country is required')
      }
      if (!selectedPaymentMethod) {
        throw new Error('Please select a payment method')
      }

      // Validate cart has items
      if (items.length === 0) {
        throw new Error('Your cart is empty')
      }

      // Transform items to the format expected by the API
      const orderItems = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price)
      }))

      console.log('Submitting order:', { 
        items: orderItems, 
        total, 
        shippingAddress: formData.address 
      })

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          total,
          shippingAddress: formData.address,
          paymentMethod: selectedPaymentMethod
        }),
      })

      const data = await response.json()
      console.log('Order API response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Clear the cart
      clearCart()

      // Redirect to order confirmation with order ID
      router.push(`/order-confirmation?orderId=${data.orderId}`)
    } catch (err) {
      console.error('Order submission error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while placing your order')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/shop')}
            className="text-sm sm:text-base text-amber-600 hover:text-amber-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="address.street" className="block text-xs sm:text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="address.city" className="block text-xs sm:text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="address.postcode" className="block text-xs sm:text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="address.postcode"
                name="address.postcode"
                value={formData.address.postcode}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="address.country" className="block text-xs sm:text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={(e) => {
                  const { name, value } = e.target
                  const [parent, child] = name.split('.')
                  setFormData(prev => ({
                    ...prev,
                    [parent]: {
                      ...((prev[parent as keyof typeof prev] || {}) as Record<string, string>),
                      [child]: value
                    }
                  }))
                }}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="England">England</option>
                <option value="Scotland">Scotland</option>
                <option value="Wales">Wales</option>
                <option value="Northern Ireland">Northern Ireland</option>
              </select>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-xs sm:text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={selectedPaymentMethod}
                onChange={e => setSelectedPaymentMethod(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method: any) => (
                  <option key={method.id} value={method.type || method.id}>
                    {method.display_name || method.displayName}
                  </option>
                ))}
              </select>
              {selectedPaymentMethod && paymentMethods.find((m: any) => (m.type || m.id) === selectedPaymentMethod) && (
                <p className="mt-2 text-xs sm:text-sm text-gray-600">
                  {paymentMethods.find((m: any) => (m.type || m.id) === selectedPaymentMethod)?.description}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="w-full bg-amber-600 text-white py-3 sm:py-4 px-4 rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Order...
                </span>
              ) : (
                `Place Order - £${typeof total === 'number' ? total.toFixed(2) : '0.00'}`
              )}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm sm:text-base flex-shrink-0">£{((typeof item.price === 'number' ? item.price : 0) * (typeof item.quantity === 'number' ? item.quantity : 0)).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between font-bold text-sm sm:text-base">
                  <p>Total</p>
                  <p>£{typeof total === 'number' ? total.toFixed(2) : '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )


}
