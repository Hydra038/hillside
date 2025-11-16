const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkFeatured() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, is_featured')
    .eq('is_featured', true)
    
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('\nCurrent featured products:')
  data.forEach(p => console.log(`- ID ${p.id}: ${p.name}`))
}

checkFeatured()
