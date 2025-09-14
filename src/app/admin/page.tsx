import { db } from '@/lib/db'
import { products } from '@/lib/db/schema.mysql'
import ProductList from './ProductList'
import AddProductForm from './AddProductForm'
import OrdersManagement from './OrdersManagement'
import AnalyticsDashboard from './AnalyticsDashboard'
import PaymentSettingsManagement from './PaymentSettingsManagement'
import UsersManagement from './users/page'
import AdminGuard from '@/components/AdminGuard'

export default async function AdminDashboardPage() {
  // Fetch products using Drizzle MySQL
  const dbProducts = await db.select().from(products);
  const allProducts = dbProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price?.toString?.() ?? '',
    imageUrl: product.image_url || undefined,
    category: product.category,
    stockQuantity: product.stock_quantity,
  createdAt: product.createdAt
  }));

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg rounded-r-3xl p-8 flex flex-col justify-between sticky top-0 h-screen">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">🛡️</span>
              <span className="text-2xl font-bold text-amber-700">Admin Panel</span>
            </div>
            <nav className="space-y-4">
              <a href="#orders" className="block px-4 py-2 rounded-lg bg-amber-100 text-amber-700 font-semibold hover:bg-amber-200 transition">Orders</a>
              <a href="#analytics" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Analytics</a>
              <a href="#payment-settings" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Payment Settings</a>
              <a href="#products" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Products</a>
              <a href="#users" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Users</a>
            </nav>
          </div>
          <div className="mt-8 text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} Firewood Admin</div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 px-10 py-12 space-y-10">
          <h1 className="text-4xl font-extrabold text-amber-700 mb-8 drop-shadow">Admin Dashboard</h1>
          <section id="orders" className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-700">Orders Management</h2>
            <OrdersManagement />
          </section>
          <section id="users" className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-700">Users Management</h2>
            <UsersManagement />
          </section>
          <section id="analytics" className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-700">Analytics Dashboard</h2>
            <AnalyticsDashboard />
          </section>
          <section id="payment-settings" className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-700">Payment Settings</h2>
            <PaymentSettingsManagement />
          </section>
          <section id="products" className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-amber-700">Add New Product</h2>
            <AddProductForm />
          </section>
          <section className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-amber-700">Current Products</h2>
            <ProductList products={allProducts} />
          </section>
        </main>
      </div>
    </AdminGuard>
  )
}
