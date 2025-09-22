import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

export default async function ShopPage() {
  let allProducts: any[] = [];

  try {
    // Fetch products directly from database using Prisma
    const dbProducts = await prisma.product.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        stockQuantity: true,
        isFeatured: true,
        createdAt: true
      }
    });

    allProducts = dbProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || undefined,
      category: product.category || undefined,
      stockQuantity: product.stockQuantity || 0,
      isFeatured: product.isFeatured || false,
      createdAt: product.createdAt
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    allProducts = [];
  }

  // Sort products: special offers first, then featured, then newest
  const sortedProducts = allProducts.sort((a: any, b: any) => {
    const aIsSpecial = (a.category === 'Special Offers') ||
      (a.name && a.name.toLowerCase().includes('special offer')) ||
      (a.name && a.name.toLowerCase().includes('offer'));
    const bIsSpecial = (b.category === 'Special Offers') ||
      (b.name && b.name.toLowerCase().includes('special offer')) ||
      (b.name && b.name.toLowerCase().includes('offer'));
    if (aIsSpecial && !bIsSpecial) return -1;
    if (!aIsSpecial && bIsSpecial) return 1;
    // If both are special or both are not, sort by isFeatured
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    // Otherwise, sort by newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Firewood Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product: any) => (
          <ProductCard key={product.id} product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price?.toString?.() ?? '',
            imageUrl: product.imageUrl || undefined,
            category: product.category,
            stockQuantity: product.stockQuantity,
            isFeatured: product.isFeatured,
            createdAt: product.createdAt
          }} />
        ))}
      </div>
    </div>
  );
}
