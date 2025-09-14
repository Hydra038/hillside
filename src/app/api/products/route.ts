
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'



export async function GET() {
  try {
    const rows = await db.select().from(products)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
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
  await db.insert(products).values(product)
  // Fetch the most recently inserted product (assuming auto-increment id)
  const [newProduct] = await db.select().from(products).orderBy(sql`${products.id} DESC`).limit(1)
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
