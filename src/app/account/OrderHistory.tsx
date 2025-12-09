'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types/db'

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        setError('')
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch orders:', response.status, errorText)
        setError(`Failed to load orders. Please try again later. (Status: ${response.status})`)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Unable to connect to the server. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatOrderStatus = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      statusColors[status as keyof typeof statusColors]
    }`
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order History</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm sm:text-base text-gray-600 mb-4">No orders yet</p>
          <a
            href="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-3 sm:p-4 hover:border-amber-500 transition-colors"
            >
              <div className="flex justify-between items-start sm:items-center gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-base sm:text-lg">£{Number(order.total).toFixed(2)}</p>
                  <span className={`${formatOrderStatus(order.status)} mt-1 text-xs`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
