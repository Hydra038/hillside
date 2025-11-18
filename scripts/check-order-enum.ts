import { supabaseAdmin } from '../src/lib/supabase-admin'

async function checkOrderEnum() {
  try {
    // Try to fetch an order to see the structure
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error fetching orders:', error)
      return
    }

    console.log('Sample order:', JSON.stringify(orders, null, 2))

    // Try different status values
    console.log('\nTrying to update with lowercase "processing"...')
    if (orders && orders.length > 0) {
      const testOrder = orders[0]
      const { data: updated1, error: error1 } = await supabaseAdmin
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', testOrder.id)
        .select()

      if (error1) {
        console.error('Error with lowercase:', error1)
      } else {
        console.log('Success with lowercase:', updated1)
      }

      // Try uppercase
      console.log('\nTrying to update with uppercase "PROCESSING"...')
      const { data: updated2, error: error2 } = await supabaseAdmin
        .from('orders')
        .update({ status: 'PROCESSING' })
        .eq('id', testOrder.id)
        .select()

      if (error2) {
        console.error('Error with uppercase:', error2)
      } else {
        console.log('Success with uppercase:', updated2)
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

checkOrderEnum()
