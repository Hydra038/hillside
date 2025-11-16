import { notFound } from 'next/navigation'
import ProductDetails from '@/components/ProductDetails'
import { supabase } from '@/lib/supabase'

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  try {
    const { id } = await params
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !product) {
      console.error('Error fetching product:', error);
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetails product={{
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
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
