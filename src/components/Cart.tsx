'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-provider'

interface CartProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Cart({ isOpen, setIsOpen }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Reset redirecting state when cart is opened
    if (isOpen) {
      setIsRedirecting(false)
    }
  }, [isOpen])

  useEffect(() => {
    // Reset redirecting state after a timeout as fallback
    if (isRedirecting) {
      const timeout = setTimeout(() => {
        setIsRedirecting(false)
      }, 5000) // Reset after 5 seconds if still stuck
      
      return () => clearTimeout(timeout)
    }
  }, [isRedirecting])

  const handleCheckout = async () => {
    try {
      console.log('handleCheckout called, user:', user, 'items:', items.length)
      
      if (items.length === 0) {
        console.log('No items in cart')
        return
      }
      
      setIsRedirecting(true)

      if (!user) {
        console.log('User not signed in, redirecting to signin')
        setIsOpen(false)
        router.push('/signin?redirect=/checkout')
        return
      }

      console.log('User signed in, redirecting to checkout')
      setIsOpen(false) // Close cart before redirecting
      router.push('/checkout')
    } catch (error) {
      console.error('Checkout error:', error)
      setIsRedirecting(false)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping Cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {items.map((item) => (
                              <li key={item.id} className="flex py-6">
                                {item.imageUrl && (
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                )}

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">£{typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        className="px-2 py-1 border rounded-md hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                      >
                                        -
                                      </button>
                                      <span className="text-gray-500">Qty {item.quantity}</span>
                                      <button
                                        type="button"
                                        className="px-2 py-1 border rounded-md hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        +
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-amber-600 hover:text-amber-500"
                                        onClick={() => removeItem(item.id)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>£{typeof total === 'number' ? total.toFixed(2) : '0.00'}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping calculated at checkout.</p>
                      <div className="mt-6 space-y-3">
                        {!user && items.length > 0 && (
                          <p className="text-sm text-gray-500 text-center">
                            Please sign in to complete your purchase
                          </p>
                        )}
                        <button
                          onClick={handleCheckout}
                          disabled={items.length === 0 || loading || isRedirecting}
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {loading || isRedirecting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {isRedirecting ? 'Redirecting...' : 'Loading...'}
                            </span>
                          ) : items.length === 0 ? (
                            'Cart is Empty'
                          ) : !user ? (
                            'Sign in to Checkout'
                          ) : (
                            'Checkout'
                          )}
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-amber-600 hover:text-amber-500"
                            onClick={() => {
                              setIsOpen(false)
                              router.push('/shop')
                            }}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
