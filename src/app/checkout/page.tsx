'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-provider'
import { useCartStore } from '@/lib/stores/cart-store'

interface PaymentMethod {
  id: number
  type?: string
  name: string
  display_name?: string
  displayName?: string
  description?: string
  enabled: boolean
  sortOrder?: number
  config?: {
    accountName?: string
    accountNumber?: string
    sortCode?: string
    bankName?: string
    email?: string
    phoneNumber?: string
    paybillNumber?: string
    tillNumber?: string
    instructions?: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, total, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isGuest, setIsGuest] = useState(false)
  const [showAuthOptions, setShowAuthOptions] = useState(false)
  const [hasChosenCheckoutType, setHasChosenCheckoutType] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
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
        console.log('Fetching payment methods...')
        const res = await fetch('/api/payment-methods')
        console.log('Payment methods response status:', res.status)
        const data = await res.json()
        console.log('Payment methods data:', data)
        
        // Check if data is an array
        if (Array.isArray(data) && data.length > 0) {
          // Parse config if it's a string
          const parsedData = data.map((method: any) => ({
            ...method,
            config: typeof method.config === 'string' ? JSON.parse(method.config) : method.config
          }))
          setPaymentMethods(parsedData)
          console.log('Payment methods loaded successfully:', parsedData.length, 'methods')
        } else {
          console.warn('No payment methods configured in database')
          setPaymentMethods([])
        }
      } catch (err) {
        console.error('Failed to fetch payment methods:', err)
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
          paymentMethod: selectedPaymentMethod,
          guestCheckout: isGuest,
          guestInfo: isGuest ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          } : undefined
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
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
      </div>

      {/* Guest Checkout Options - Only show if not logged in AND haven't chosen yet */}
      {!user && !hasChosenCheckoutType && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">How would you like to checkout?</h2>
            <button
              onClick={() => router.push('/shop')}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Shop
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Guest Checkout Option */}
            <button
              onClick={() => {
                setIsGuest(true)
                setHasChosenCheckoutType(true)
                setShowAuthOptions(false)
              }}
              className="flex flex-col items-start p-6 bg-white border-2 border-amber-300 rounded-lg hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
                  🛒
                </div>
                <h3 className="text-lg font-bold text-gray-900">Continue as Guest</h3>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Quick checkout without creating an account. You'll still receive order confirmation via email.
              </p>
              <div className="mt-4 flex items-center text-amber-600 font-semibold text-sm group-hover:text-amber-700">
                <span>Continue →</span>
              </div>
            </button>

            {/* Sign In / Sign Up Option */}
            <button
              onClick={() => setShowAuthOptions(true)}
              className="flex flex-col items-start p-6 bg-white border-2 border-gray-300 rounded-lg hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sign In / Sign Up</h3>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Create an account or sign in to track orders, save addresses, and get exclusive offers.
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                <span>Sign In →</span>
              </div>
            </button>
          </div>

          {showAuthOptions && (
            <div className="mt-6 p-6 bg-white rounded-lg border-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose an option</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/signin?redirect=/checkout')}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup?redirect=/checkout')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setShowAuthOptions(false)}
                  className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show checkout form only when user is logged in OR guest has been chosen */}
      {(user || hasChosenCheckoutType) && (
        <>
          {isGuest && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      You're checking out as a guest. You can create an account later to track your orders.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsGuest(false)
                    setHasChosenCheckoutType(false)
                  }}
                  className="ml-4 flex-shrink-0 text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          )}

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

            {isGuest && (
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+44 7XXX XXXXXX"
                  className="mt-1 block w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            )}

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
              <label htmlFor="paymentMethod" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              {paymentMethods.length === 0 ? (
                <div className="mt-1 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ No payment methods are currently configured. Please contact the store administrator.
                  </p>
                </div>
              ) : (
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
              )}
              
              {/* Payment Details Box */}
              {selectedPaymentMethod && (() => {
                const method = paymentMethods.find((m: any) => (m.type || m.id) === selectedPaymentMethod);
                if (!method) return null;
                
                return (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="font-semibold text-sm text-amber-900 mb-2">
                      Payment Instructions
                    </h3>
                    
                    {method.description && (
                      <p className="text-xs sm:text-sm text-gray-700 mb-3">
                        {method.description}
                      </p>
                    )}
                    
                    {/* Show config details */}
                    {method.config && (
                      <div className="space-y-2 text-sm">
                        {method.config.accountName && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Account Name:</span>
                            <span className="font-medium text-gray-900">{method.config.accountName}</span>
                          </div>
                        )}
                        
                        {method.config.accountNumber && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Account Number:</span>
                            <span className="font-mono font-medium text-gray-900">{method.config.accountNumber}</span>
                          </div>
                        )}
                        
                        {method.config.sortCode && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Sort Code:</span>
                            <span className="font-mono font-medium text-gray-900">{method.config.sortCode}</span>
                          </div>
                        )}
                        
                        {method.config.bankName && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Bank Name:</span>
                            <span className="font-medium text-gray-900">{method.config.bankName}</span>
                          </div>
                        )}
                        
                        {method.config.email && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Email:</span>
                            <span className="font-mono font-medium text-gray-900">{method.config.email}</span>
                          </div>
                        )}
                        
                        {method.config.phoneNumber && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Phone Number:</span>
                            <span className="font-mono font-medium text-gray-900">{method.config.phoneNumber}</span>
                          </div>
                        )}
                        
                        {method.config.paybillNumber && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Paybill Number:</span>
                            <span className="font-mono font-medium text-gray-900">{method.config.paybillNumber}</span>
                          </div>
                        )}
                        
                        {method.config.tillNumber && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-600">Till Number:</span>
                            <span className="font-mono font-medium text-gray-900">{method.config.tillNumber}</span>
                          </div>
                        )}
                        
                        {method.config.instructions && (
                          <div className="mt-3 p-2 bg-white rounded border border-amber-300">
                            <p className="text-xs text-gray-700 whitespace-pre-line">{method.config.instructions}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 p-2 bg-amber-100 rounded text-xs text-amber-800">
                      <strong>Note:</strong> Please complete the payment and keep your reference number. Your order will be processed once payment is confirmed.
                    </div>
                  </div>
                );
              })()}
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
        </>
      )}
    </div>
  )


}
