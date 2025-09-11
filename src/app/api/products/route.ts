import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';

// Database queries moved to GET and POST handlers

export async function GET() {
  try {
    const dbProducts = await db.query.products.findMany();
    return NextResponse.json(dbProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProduct = await db
      .insert(products)
      .values({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        imageUrl: body.imageUrl,
        stockQuantity: body.stockQuantity,
        weight: body.weight,
        dimensions: body.dimensions,
        moisture: body.moisture,
        season: body.season,
        features: body.features,
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
