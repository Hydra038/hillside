import { supabaseAdmin } from '@/lib/supabase-admin'
import AdminGuard from '@/components/AdminGuard'
import AdminDashboardContent from './AdminDashboardContent'

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
      <AdminDashboardContent products={mappedProducts} />
    </AdminGuard>
  )
}
