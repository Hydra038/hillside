import { supabaseAdmin } from '@/lib/supabase-admin'
import ProductList from './ProductList'
import AddProductForm from './AddProductForm'
import OrdersManagement from './OrdersManagement'
import AnalyticsDashboard from './AnalyticsDashboard'
import PaymentSettingsManagement from './PaymentSettingsManagement'
import AdminGuard from '@/components/AdminGuard'

// Force dynamic rendering to avoid build-time database connection
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  // Fetch products using Supabase client
  const { data: allProducts } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  // Map to the expected format
  const mappedProducts = (allProducts || []).map(product => ({
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
        <div className="flex flex-col xl:flex-row">
          {/* Sidebar - hidden on mobile/tablet, shown on extra large screens */}
          <aside className="hidden xl:block xl:w-64 2xl:w-72 bg-white shadow-lg xl:rounded-r-3xl p-6 xl:p-8 xl:sticky xl:top-0 xl:h-screen overflow-y-auto">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl xl:text-4xl">🛡️</span>
                <span className="text-xl xl:text-2xl font-bold text-amber-700">Admin Panel</span>
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

          {/* Mobile/Tablet Navigation - shown on mobile and tablet, hidden on xl screens */}
          <div className="xl:hidden bg-white shadow-md p-3 sm:p-4 sticky top-16 z-30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl sm:text-2xl">🛡️</span>
              <span className="text-base sm:text-lg font-bold text-amber-700">Admin Panel</span>
            </div>
            <nav className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              <a href="#orders" className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 font-semibold text-xs sm:text-sm">Orders</a>
              <a href="#analytics" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-100">Analytics</a>
              <a href="#payment-settings" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-100">Payments</a>
              <a href="#products" className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-100">Products</a>
            </nav>
          </div>

          {/* Main Content - responsive width and padding */}
          <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 xl:px-10 2xl:px-12 py-4 sm:py-6 md:py-8 xl:py-12 space-y-4 sm:space-y-6 xl:space-y-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-amber-700 mb-3 sm:mb-4 xl:mb-8 drop-shadow">Admin Dashboard</h1>
            
            <section id="orders" className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 xl:p-8 rounded-xl xl:rounded-2xl shadow-lg mb-4 sm:mb-6 xl:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 xl:mb-6 text-amber-700">Orders Management</h2>
              <OrdersManagement />
            </section>
            
            <section id="analytics" className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 xl:p-8 rounded-xl xl:rounded-2xl shadow-lg mb-4 sm:mb-6 xl:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 xl:mb-6 text-amber-700">Analytics Dashboard</h2>
              <AnalyticsDashboard />
            </section>
            
            <section id="payment-settings" className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 xl:p-8 rounded-xl xl:rounded-2xl shadow-lg mb-4 sm:mb-6 xl:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 xl:mb-6 text-amber-700">Payment Settings</h2>
              <PaymentSettingsManagement />
            </section>
            
            <section id="products" className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 xl:p-8 rounded-xl xl:rounded-2xl shadow-lg">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-amber-700">Add New Product</h2>
              <AddProductForm />
            </section>
            
            <section className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 md:p-6 xl:p-8 rounded-xl xl:rounded-2xl shadow-lg">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-amber-700">Current Products</h2>
              <ProductList products={mappedProducts} />
            </section>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
