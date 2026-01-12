'use client'

import { useState } from 'react'
import ProductList from './ProductList'
import AddProductForm from './AddProductForm'
import OrdersManagement from './OrdersManagement'
import AnalyticsDashboard from './AnalyticsDashboard'
import PaymentSettingsManagement from './PaymentSettingsManagement'

// Collapsible Section Component
function CollapsibleSection({ 
  id, 
  title, 
  subtitle, 
  icon, 
  gradient,
  children,
  isOpen,
  onToggle
}: { 
  id: string
  title: string
  subtitle: string
  icon: string
  gradient: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={onToggle}
          className={`w-full px-6 py-4 ${gradient} flex items-center justify-between hover:opacity-95 transition-opacity`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="text-xs text-white/80">{subtitle}</p>
            </div>
          </div>
          <div className="text-white text-2xl transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </div>
        </button>
        
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

// Client Component for managing state
export default function AdminDashboardContent({ products }: { products: any[] }) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['analytics']))

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setOpenSections(new Set(['analytics', 'orders', 'payment-settings', 'add-product', 'products']))
  }

  const collapseAll = () => {
    setOpenSections(new Set())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Modern Sidebar - hidden on mobile, shown on lg+ screens */}
        <aside className="hidden lg:block lg:w-72 bg-gradient-to-b from-amber-600 to-amber-700 shadow-2xl lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
          <div className="p-8">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Firewood</div>
                <div className="text-xs text-amber-200">Admin Dashboard</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <a href="#analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white font-semibold hover:bg-white/30 transition-all duration-200 group">
                <span className="text-xl">📊</span>
                <span>Analytics</span>
              </a>
              <a href="#orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group">
                <span className="text-xl">📦</span>
                <span>Orders</span>
              </a>
              <a href="#products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group">
                <span className="text-xl">🛍️</span>
                <span>Products</span>
              </a>
              <a href="#payment-settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group">
                <span className="text-xl">💳</span>
                <span>Payments</span>
              </a>
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="text-xs font-semibold text-amber-200 uppercase mb-3">Quick Actions</div>
              <div className="space-y-2">
                <a href="#add-product" className="flex items-center gap-2 text-sm text-white hover:text-amber-100 transition">
                  <span>➕</span> Add Product
                </a>
                <a href="/" className="flex items-center gap-2 text-sm text-white hover:text-amber-100 transition">
                  <span>🏠</span> View Store
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center text-xs text-amber-200">
            &copy; {new Date().getFullYear()} Firewood Store
          </div>
        </aside>

        {/* Mobile Header & Navigation */}
        <div className="lg:hidden bg-white shadow-md sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Firewood Admin</div>
              </div>
            </div>
            <a href="/" className="text-sm text-amber-600 font-medium hover:text-amber-700">View Store</a>
          </div>
          <nav className="flex overflow-x-auto gap-1 px-4 py-2 bg-gray-50">
            <a href="#analytics" className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium shadow-sm">
              <span>📊</span> Analytics
            </a>
            <a href="#orders" className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100">
              <span>📦</span> Orders
            </a>
            <a href="#products" className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100">
              <span>🛍️</span> Products
            </a>
            <a href="#payment-settings" className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100">
              <span>💳</span> Payments
            </a>
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your firewood store</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <span>📂</span> Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <span>📁</span> Collapse All
                </button>
              </div>
            </div>

            {/* Analytics Section */}
            <CollapsibleSection
              id="analytics"
              title="Analytics Overview"
              subtitle="Track your store performance"
              icon="📊"
              gradient="bg-gradient-to-r from-amber-500 to-amber-600"
              isOpen={openSections.has('analytics')}
              onToggle={() => toggleSection('analytics')}
            >
              <AnalyticsDashboard />
            </CollapsibleSection>

            {/* Orders Section */}
            <CollapsibleSection
              id="orders"
              title="Orders Management"
              subtitle="View and manage customer orders"
              icon="📦"
              gradient="bg-gradient-to-r from-blue-500 to-blue-600"
              isOpen={openSections.has('orders')}
              onToggle={() => toggleSection('orders')}
            >
              <OrdersManagement />
            </CollapsibleSection>

            {/* Payment Settings Section */}
            <CollapsibleSection
              id="payment-settings"
              title="Payment Settings"
              subtitle="Configure payment methods"
              icon="💳"
              gradient="bg-gradient-to-r from-green-500 to-green-600"
              isOpen={openSections.has('payment-settings')}
              onToggle={() => toggleSection('payment-settings')}
            >
              <PaymentSettingsManagement />
            </CollapsibleSection>

            {/* Add Product Section */}
            <CollapsibleSection
              id="add-product"
              title="Add New Product"
              subtitle="Create a new product listing"
              icon="➕"
              gradient="bg-gradient-to-r from-purple-500 to-purple-600"
              isOpen={openSections.has('add-product')}
              onToggle={() => toggleSection('add-product')}
            >
              <AddProductForm />
            </CollapsibleSection>

            {/* Product List Section */}
            <CollapsibleSection
              id="products"
              title="Product Inventory"
              subtitle="Manage your product catalog"
              icon="🛍️"
              gradient="bg-gradient-to-r from-orange-500 to-orange-600"
              isOpen={openSections.has('products')}
              onToggle={() => toggleSection('products')}
            >
              <ProductList products={products} />
            </CollapsibleSection>
          </div>
        </main>
      </div>
    </div>
  )
}
