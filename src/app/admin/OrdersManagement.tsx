'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types/db'

interface OrderWithUser extends Order {
  paymentMethod?: string | null;
  paymentPlan?: string | null;
  user?: {
    name: string;
    email: string;
  };
  itemCount?: number;
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    priceAtTime: string;
    product?: {
      name: string;
      price: string;
    };
  }>;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
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

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedOrder(data.order)
        setShowDetails(true)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus as any }
            : order
        ))
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdating(null)
    }
  }

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedOrders.size === 0) return

    try {
      const promises = Array.from(selectedOrders).map(orderId =>
        updateOrderStatus(orderId, newStatus)
      )
      await Promise.all(promises)
      setSelectedOrders(new Set())
    } catch (error) {
      console.error('Error in bulk update:', error)
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const selectAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)))
    }
  }

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Status', 'Payment Method', 'Payment Plan'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.user?.name || 'Unknown',
        order.user?.email || 'No email',
        new Date(order.createdAt).toLocaleDateString(),
        `£${Number(order.total).toFixed(2)}`,
        order.status,
        order.paymentMethod || 'Not specified',
        order.paymentPlan === 'full' ? 'Full Payment' : order.paymentPlan === 'half' ? 'Split Payment (50% upfront)' : order.paymentPlan || 'Not specified'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = !searchTerm ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => {
          const count = status === 'all'
            ? orders.length
            : orders.filter(o => o.status === status).length

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`p-3 rounded-lg text-center transition-colors ${filter === status
                  ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm capitalize">{status}</div>
            </button>
          )
        })}
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search orders, customers, or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1"
          />
          <button
            onClick={exportOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            📊 Export CSV
          </button>
        </div>

        {selectedOrders.size > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 flex items-center">
              {selectedOrders.size} selected
            </span>
            <select
              onChange={(e) => bulkUpdateStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Bulk Action</option>
              <option value="pending">Mark Pending</option>
              <option value="processing">Mark Processing</option>
              <option value="shipped">Mark Shipped</option>
              <option value="delivered">Mark Delivered</option>
              <option value="cancelled">Mark Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">
            {filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
            ({filteredOrders.length})
          </h3>
        </div>
        <div className="min-w-[700px] md:min-w-full">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                    onChange={selectAllOrders}
                    className="rounded"
                  />
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Plan</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={
                    `transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-amber-50`
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button
                      onClick={() => fetchOrderDetails(order.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      #{order.id.slice(0, 8)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.paymentMethod || <span className="text-gray-400 italic">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.paymentPlan || <span className="text-gray-400 italic">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updating === order.id && (
                      <span className="text-xs text-gray-500">Updating...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <div className="text-gray-500">
              {searchTerm ? `🔍 No orders found matching "${searchTerm}"` :
                filter === 'all' ? (
                  <div>
                    <p className="text-lg mb-2">No orders yet</p>
                    <p className="text-sm">Orders from customers will appear here when they make purchases.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg mb-2">No {filter} orders</p>
                    <p className="text-sm">No orders are currently in {filter} status.</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto border border-amber-100">
            <div className="p-4 sm:p-8">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-amber-700 flex items-center gap-2">
                  <span className="inline-block bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-sm font-semibold mr-2">Order</span>
                  #{selectedOrder.id.slice(0, 8)}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-amber-600 text-2xl font-bold transition-colors"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3 text-amber-700 flex items-center gap-2">
                    <span className="inline-block bg-amber-50 text-amber-700 rounded px-2 py-0.5 text-xs font-semibold">Customer</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedOrder.user?.name || 'Unknown'}</div>
                    <div><strong>Email:</strong> {selectedOrder.user?.email || 'No email'}</div>
                    <div><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                    <div><strong>Status:</strong>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Payment Info */}
                <div>
                  <h3 className="font-semibold mb-3 text-amber-700 flex items-center gap-2">
                    <span className="inline-block bg-amber-50 text-amber-700 rounded px-2 py-0.5 text-xs font-semibold">Payment</span>
                  </h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Method:</strong> {selectedOrder.paymentMethod || <span className="text-gray-400 italic">-</span>}</div>
                    <div><strong>Plan:</strong> {selectedOrder.paymentPlan || <span className="text-gray-400 italic">-</span>}</div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold mb-3 text-amber-700 flex items-center gap-2">
                    <span className="inline-block bg-amber-50 text-amber-700 rounded px-2 py-0.5 text-xs font-semibold">Shipping</span>
                  </h3>
                  <div className="text-sm">
                    {selectedOrder.shippingAddress && typeof selectedOrder.shippingAddress === 'object' ? (
                      <div className="space-y-1">
                        <div>{(selectedOrder.shippingAddress as any).street}</div>
                        <div>{(selectedOrder.shippingAddress as any).city}</div>
                        <div>{(selectedOrder.shippingAddress as any).postcode}</div>
                        <div>{(selectedOrder.shippingAddress as any).country}</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No shipping address</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-8">
                <h3 className="font-semibold mb-3 text-amber-700 flex items-center gap-2">
                  <span className="inline-block bg-amber-50 text-amber-700 rounded px-2 py-0.5 text-xs font-semibold">Items</span>
                </h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div>
                          <div className="font-medium text-amber-900">{item.product?.name || 'Unknown Product'}</div>
                          <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-amber-900">£{Number(item.priceAtTime).toFixed(2)}</div>
                          <div className="text-sm text-gray-600">each</div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex justify-between items-center font-bold text-lg text-amber-800">
                      <span>Total:</span>
                      <span>£{Number(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">✅ No order items to display</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
