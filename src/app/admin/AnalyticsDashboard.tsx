'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  recentOrders: Array<{
    id: string
    total: string
    customerName: string
    createdAt: string
  }>
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // days

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        console.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2">No Analytics Data</h3>
        <p>Unable to load analytics data at this time.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">£{analytics.totalRevenue.toFixed(2)}</div>
          <div className="text-blue-100">Total Revenue</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">{analytics.totalOrders}</div>
          <div className="text-green-100">Total Orders</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">{analytics.totalCustomers}</div>
          <div className="text-purple-100">Total Customers</div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-lg text-white">
          <div className="text-3xl font-bold">£{analytics.averageOrderValue.toFixed(2)}</div>
          <div className="text-amber-100">Avg Order Value</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📋 Recent Orders</h3>
          <div className="space-y-3">
            {analytics.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">#{order.id.slice(0, 8)}</div>
                  <div className="text-sm text-gray-600">{order.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">£{Number(order.total).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">🏆 Top Products</h3>
          <div className="space-y-3">
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                  </span>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.quantity} sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">£{product.revenue.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart (Simple Text-based) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📈 Monthly Revenue Trend</h3>
        <div className="space-y-2">
          {analytics.monthlyRevenue.map((month) => {
            const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue))
            const width = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
            
            return (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600">{month.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      £{month.revenue.toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-600">{month.orders} orders</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const csvContent = [
              ['Metric', 'Value'].join(','),
              ['Total Revenue', `£${analytics.totalRevenue.toFixed(2)}`].join(','),
              ['Total Orders', analytics.totalOrders].join(','),
              ['Total Customers', analytics.totalCustomers].join(','),
              ['Average Order Value', `£${analytics.averageOrderValue.toFixed(2)}`].join(','),
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
            a.click()
            window.URL.revokeObjectURL(url)
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          📊 Export Analytics
        </button>
      </div>
    </div>
  )
}
