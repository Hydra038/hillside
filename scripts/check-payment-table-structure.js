const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkTableStructure() {
  console.log('\n🔍 Checking payment_settings table structure...\n')
  
  const { data: existingData } = await supabase
    .from('payment_settings')
    .select('*')
    .limit(1)
  
  if (existingData && existingData.length > 0) {
    console.log('📋 Available columns:')
    console.log(Object.keys(existingData[0]).join(', '))
    console.log('\n📄 Sample record:')
    console.log(JSON.stringify(existingData[0], null, 2))
  }
}

checkTableStructure()
