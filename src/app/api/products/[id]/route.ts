import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const product = await db.select().from(products).where(eq(products.id, parseInt(params.id)))
    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(product[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const updates = await request.json();
    await db
      .update(products)
      .set(updates)
      .where(eq(products.id, parseInt(params.id)));
    const updatedProduct = await db.select().from(products).where(eq(products.id, parseInt(params.id)));
    if (updatedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    await db
      .delete(products)
      .where(eq(products.id, parseInt(params.id)));
    // Optionally, you can return a success message or the deleted id
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
