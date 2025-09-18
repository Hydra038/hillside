
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('API: Attempting to fetch products...')
    
    const products = await prisma.product.findMany({
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
        createdAt: true,
        updatedAt: true,
        features: true
      }
    })
    
    console.log(`API: Successfully fetched ${products.length} products`)
    return NextResponse.json(products)
  } catch (error) {
    console.error('API Error fetching products:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    let product = await request.json();
    console.log('Received product payload:', product);
    
    // Map frontend field names to Prisma model fields
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || product.image_url,
      stockQuantity: product.stockQuantity || product.stock_quantity || 0,
      season: product.season,
      features: product.features,
      isFeatured: product.is_featured || false
    };

    // Insert product using correct Prisma model
    const newProduct = await prisma.product.create({
      data: productData
    });
    
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
