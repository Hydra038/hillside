import { db } from '@/lib/db'
import { products } from '@/lib/db/schema.mysql'
import ProductList from './ProductList'
import AddProductForm from './AddProductForm'
import OrdersManagement from './OrdersManagement'
import AnalyticsDashboard from './AnalyticsDashboard'
import AdminGuard from '@/components/AdminGuard'

export default async function AdminDashboardPage() {
  const allProducts = await db.select().from(products)

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-8">
              <nav className="space-y-2">
                <a 
                  href="#orders" 
                  className="block px-4 py-2 rounded-md bg-amber-50 text-amber-700 font-medium"
                >
                  Orders
                </a>
                <a 
                  href="#analytics" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  Analytics
                </a>
                <a 
                  href="#products" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  Products
                </a>
              </nav>
            </div>
          </div>

          <div className="col-span-3 space-y-8">
            <section id="orders" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
              <OrdersManagement />
            </section>

            <section id="analytics" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
              <AnalyticsDashboard />
            </section>

            <section id="products" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <AddProductForm />
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Current Products</h2>
              <ProductList products={allProducts} />
            </section>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
