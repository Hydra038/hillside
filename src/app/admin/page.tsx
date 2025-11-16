import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import ProductList from './ProductList'
import AddProductForm from './AddProductForm'
import OrdersManagement from './OrdersManagement'
import AnalyticsDashboard from './AnalyticsDashboard'
import PaymentSettingsManagement from './PaymentSettingsManagement'
import AdminGuard from '@/components/AdminGuard'

export default async function AdminDashboardPage() {
  // Use raw SQL to fetch products with only existing columns
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL!);
  const dbProducts = await sql`
    SELECT id, name, description, price, image_url, category, stock_quantity, is_featured, created_at
    FROM products
  `;
  const allProducts = dbProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price?.toString?.() ?? '',
    imageUrl: product.image_url || undefined,
    category: product.category,
    stockQuantity: product.stock_quantity,
    isFeatured: product.is_featured,
    createdAt: product.created_at
  }));

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - hidden on mobile, shown on desktop */}
          <aside className="hidden lg:block lg:w-64 bg-white shadow-lg lg:rounded-r-3xl p-6 lg:p-8 lg:sticky lg:top-0 lg:h-screen">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl lg:text-4xl">🛡️</span>
                <span className="text-xl lg:text-2xl font-bold text-amber-700">Admin Panel</span>
              </div>
              <nav className="space-y-4">
                <a href="#orders" className="block px-4 py-2 rounded-lg bg-amber-100 text-amber-700 font-semibold hover:bg-amber-200 transition">Orders</a>
                <a href="#analytics" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Analytics</a>
                <a href="#payment-settings" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Payment Settings</a>
                <a href="#products" className="block px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">Products</a>
              </nav>
            </div>
            <div className="mt-8 text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} Firewood Admin</div>
          </aside>

          {/* Mobile Navigation - shown only on mobile */}
          <div className="lg:hidden bg-white shadow-md p-4 sticky top-16 z-30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🛡️</span>
              <span className="text-lg font-bold text-amber-700">Admin Panel</span>
            </div>
            <nav className="flex overflow-x-auto gap-2 pb-2">
              <a href="#orders" className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 font-semibold text-sm">Orders</a>
              <a href="#analytics" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-700 font-semibold text-sm hover:bg-gray-100">Analytics</a>
              <a href="#payment-settings" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-700 font-semibold text-sm hover:bg-gray-100">Payments</a>
              <a href="#products" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-700 font-semibold text-sm hover:bg-gray-100">Products</a>
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-12 space-y-6 lg:space-y-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 mb-4 lg:mb-8 drop-shadow">Admin Dashboard</h1>
            
            <section id="orders" className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 text-amber-700">Orders Management</h2>
              <OrdersManagement />
            </section>
            
            <section id="analytics" className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 text-amber-700">Analytics Dashboard</h2>
              <AnalyticsDashboard />
            </section>
            
            <section id="payment-settings" className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 text-amber-700">Payment Settings</h2>
              <PaymentSettingsManagement />
            </section>
            
            <section id="products" className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-amber-700">Add New Product</h2>
              <AddProductForm />
            </section>
            
            <section className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-amber-700">Current Products</h2>
              <ProductList products={allProducts} />
            </section>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
