'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types/db'

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [unauthenticated, setUnauthenticated] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.status === 401) {
        setUnauthenticated(true)
        setOrders([])
      } else if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : unauthenticated ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please sign in to view your order history.</p>
          <a
            href="/account/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
          >
            Sign In
          </a>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <a
            href="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{Number(order.total).toFixed(2)}</p>
                    <span className={formatOrderStatus(order.status)}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    {order.shippingAddress && (
                      <div className="text-sm text-gray-600">
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}</p>
                        <p>{order.shippingAddress.postcode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
