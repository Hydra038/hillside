import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
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
    
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: updates
    });
    
    return NextResponse.json(updatedProduct);
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
    
    await prisma.product.delete({
      where: { id: parseInt(params.id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
