import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'

export async function GET() {
  try {
    const allProducts = await db.select().from(products)
    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    let product = await request.json();
    console.log('Received product payload:', product);
    // Map frontend field names to DB schema
    if (product.imageUrl) {
      product.image_url = product.imageUrl;
      delete product.imageUrl;
    }
    if (product.stockQuantity !== undefined) {
      product.stock_quantity = product.stockQuantity;
      delete product.stockQuantity;
    }
  // features is already an array, do not stringify
    if (product.dimensions && typeof product.dimensions !== 'string') {
      product.dimensions = JSON.stringify(product.dimensions);
    }
    // Insert product
    const newProduct = await db.insert(products).values(product).returning();
    return NextResponse.json(newProduct[0]);
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
