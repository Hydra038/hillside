import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import ProductList from './ProductList'
import AddProductForm from './AddProductForm'
import OrdersManagement from './OrdersManagement'
import UserManagement from './UserManagement'
import AnalyticsDashboard from './AnalyticsDashboard'
import AdminGuard from '@/components/AdminGuard'

export default async function AdminDashboardPage() {
  // Get all products
  const allProducts = await db.select().from(products)

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🏢 Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-8">
              <nav className="space-y-2">
                <a 
                  href="#orders" 
                  className="block px-4 py-2 rounded-md bg-amber-50 text-amber-700 font-medium"
                >
                  📦 Orders
                </a>
                <a 
                  href="#analytics" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  📊 Analytics
                </a>
                <a 
                  href="#users" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  👥 Users
                </a>
                <a 
                  href="#products" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  🛍️ Products
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3 space-y-8">
            {/* Orders Management */}
            <section id="orders" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">📦 Orders Management</h2>
              <OrdersManagement />
            </section>

            {/* Analytics Dashboard */}
            <section id="analytics" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">📊 Analytics Dashboard</h2>
              <AnalyticsDashboard />
            </section>

            {/* User Management */}
            <section id="users" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">👥 User Management</h2>
              <UserManagement />
            </section>

            {/* Add Product Form */}
            <section id="products" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">➕ Add New Product</h2>
              <AddProductForm />
            </section>

            {/* Product List */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">🛍️ Current Products</h2>
              <ProductList products={allProducts} />
            </section>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
