import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    
    return NextResponse.json(featuredProducts)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 })
  }
}
