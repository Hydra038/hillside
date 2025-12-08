import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: allProducts, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
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
    const dbProduct: any = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.imageUrl || product.imageUrlManual || '',
      stock_quantity: product.stockQuantity,
      season: product.season,
      features: product.features // Keep as array
    };
    
    console.log('Mapped DB product:', dbProduct);
    
    // Insert product using Supabase
    const { data: newProduct, error } = await supabaseAdmin
      .from('products')
      .insert(dbProduct)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
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
