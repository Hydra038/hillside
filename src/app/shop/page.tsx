import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default async function ShopPage() {
  const { data: allProducts, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Firewood Products</h1>
        <p className="text-red-600">Error loading products. Please try again later.</p>
      </div>
    );
  }

  // Sort products to show special offers first
  const sortedProducts = (allProducts || []).sort((a, b) => {
    const aIsSpecial = a.category === 'Special Offers' || 
                      a.name.toLowerCase().includes('special offer') ||
                      a.name.toLowerCase().includes('offer');
    const bIsSpecial = b.category === 'Special Offers' || 
                      b.name.toLowerCase().includes('special offer') ||
                      b.name.toLowerCase().includes('offer');
    if (aIsSpecial && !bIsSpecial) return -1;
    if (!aIsSpecial && bIsSpecial) return 1;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Firewood Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price?.toString?.() ?? '',
            imageUrl: product.image_url || undefined,
            category: product.category,
            stockQuantity: product.stock_quantity,
            isFeatured: product.is_featured,
            createdAt: product.created_at
          }} />
        ))}
      </div>
    </div>
  );
}
