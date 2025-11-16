import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    console.log('Orders TEST: Starting test')
    
    // Check database connection
    const { data: testOrders, error: dbError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .limit(1)
    
    console.log('Orders TEST: Database connection OK, orders count:', testOrders?.length || 0)
    
    if (dbError) {
      console.error('Orders TEST: Database error:', dbError)
      return NextResponse.json({ 
        success: false, 
        dbConnection: false,
        error: dbError.message
      })
    }
    
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    console.log('Orders TEST: Token present:', !!token)
    
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
        console.log('Orders TEST: JWT valid, user:', decoded.userId)
        
        return NextResponse.json({ 
          success: true, 
          dbConnection: true, 
          authValid: true,
          userId: decoded.userId,
          ordersCount: testOrders?.length || 0
        })
      } catch (jwtError) {
        console.log('Orders TEST: JWT error:', jwtError)
        return NextResponse.json({ 
          success: false, 
          dbConnection: true, 
          authValid: false,
          error: 'JWT verification failed'
        })
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      dbConnection: true, 
      authValid: false,
      error: 'No token found'
    })
    
  } catch (error) {
    console.error('Orders TEST: Error:', error)
    return NextResponse.json({ 
      success: false, 
      dbConnection: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
