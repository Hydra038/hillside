import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch enabled payment methods (public endpoint)
export async function GET() {
  try {
    const { data: paymentSettings, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('enabled', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching payment methods:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payment methods' },
        { status: 500 }
      )
    }

    return NextResponse.json(paymentSettings || [])
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}
