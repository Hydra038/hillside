import { supabaseAdmin } from '@/lib/supabase-admin'

export async function getOrders(userId: string) {
  try {
    const { data: userOrders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return userOrders || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
