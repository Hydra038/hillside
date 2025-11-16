const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Realistic UK firewood products with proper sizes and prices
const productUpdates = [
  {
    id: 1,
    name: 'Kiln Dried Oak Logs - Large Net (40kg)',
    description: 'Premium British oak logs, kiln dried to <20% moisture content. Perfect for wood burners and open fires. Approximately 40kg per net. Ready to burn immediately with excellent heat output and long burn time.',
    price: '6.99',
    category: 'hardwood'
  },
  {
    id: 2,
    name: 'Mixed Hardwood Logs - Bulk Bag (250kg)',
    description: 'A perfect mix of oak, ash, and beech for versatile burning. Kiln dried to <20% moisture. Approximately 250kg per bulk bag (around 0.7m³). Ideal for regular users with excellent value.',
    price: '110.00',
    category: 'hardwood'
  },
  {
    id: 3,
    name: 'Birch Logs - Small Net (20kg)',
    description: 'Beautiful white birch logs that burn cleanly with a pleasant aroma. Kiln dried to <20% moisture. Approximately 20kg per small net. Perfect for occasional fires.',
    price: '5.49',
    category: 'hardwood'
  },
  {
    id: 6,
    name: 'British Pine Kindling - Net Bag (3kg)',
    description: 'Kiln dried British pine kindling in convenient net bag. <20% moisture content. Approximately 3kg per bag. Perfect for starting fires quickly and easily.',
    price: '4.99',
    category: 'softwood'
  },
  {
    id: 11,
    name: 'Mixed Hardwood Logs - Dumpy Bag (1m³ Loose)',
    description: 'Large dumpy bag of mixed British hardwoods (oak, ash, beech). Kiln dried to <20% moisture. Approximately 1 cubic meter loose volume (around 350-400kg). Best value for serious wood burner users.',
    price: '145.00',
    category: 'hardwood'
  },
  {
    id: 14,
    name: 'Compressed Heat Logs - Box of 10',
    description: 'Eco-friendly compressed logs made from sawdust. Clean burning with high heat output. Box of 10 logs (approximately 12kg). Each log burns for 2-3 hours. Great alternative to traditional logs.',
    price: '18.99',
    category: 'manufactured'
  },
  {
    id: 20,
    name: 'Natural Firelighters - Box of 200',
    description: 'Chemical-free wood wool firelighters. Box of 200 pieces. Made from sustainable wood shavings and natural wax. Safe, effective, and eco-friendly way to start your fire.',
    price: '8.99',
    category: 'accessories'
  },
  {
    id: 21,
    name: 'Smokeless Coal - 25kg Bag',
    description: 'Premium smokeless coal approved for smoke control areas. Clean burning with long-lasting heat. 25kg bag. Ideal for overnight burning in multi-fuel stoves.',
    price: '22.50',
    category: 'smokeless-fuel'
  },
  {
    id: 22,
    name: 'Premium Wood Pellets - 15kg Bag',
    description: 'High-quality wood pellets for pellet stoves and biomass boilers. 15kg bag. Made from 100% compressed sawdust. <0.5% ash content. Efficient, clean burning fuel.',
    price: '9.99',
    category: 'pellets'
  },
  {
    id: 23,
    name: 'Premium Firewood Gift Box - 30kg',
    description: 'Beautifully presented firewood gift box containing premium kiln dried logs (25kg), kindling (3kg), and natural firelighters (20 pieces). Perfect gift for wood burner owners.',
    price: '35.00',
    category: 'gift-sets'
  },
  {
    id: 24,
    name: 'Commercial Bulk Deal - 5 Crates (5m³)',
    description: 'Commercial bulk deal - 5 wooden crates of mixed hardwood logs. Kiln dried to <20% moisture. Total 5 cubic meters (approximately 1.75 tonnes). Delivered on pallet. Best value for commercial use or heating large properties.',
    price: '650.00',
    category: 'bulk-commercial'
  },
  {
    id: 25,
    name: 'Premium Mixed Logs - Large Net (40kg)',
    description: 'Premium selection of British hardwoods including oak, ash, and beech. Kiln dried to <20% moisture. Approximately 40kg per large net. Hand-selected larger logs for extended burn time.',
    price: '7.99',
    category: 'premium'
  }
]

async function updateProducts() {
  console.log('\n🔄 Updating products with proper sizes, quantities, and UK market prices...\n')
  console.log('=' .repeat(80))
  
  for (const update of productUpdates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: update.name,
          description: update.description,
          price: update.price
        })
        .eq('id', update.id)
        .select()

      if (error) {
        console.error(`❌ Error updating product ${update.id}:`, error)
      } else {
        console.log(`✅ Updated: ${update.name} - £${update.price}`)
      }
    } catch (error) {
      console.error(`❌ Error updating product ${update.id}:`, error)
    }
  }
  
  console.log('\n' + '=' .repeat(80))
  console.log('\n✅ Product updates complete!')
  console.log('\n📊 Summary of changes:')
  console.log('  • Added weight/size information to all product names')
  console.log('  • Updated descriptions with specific quantities')
  console.log('  • Adjusted prices to UK market standards:')
  console.log('    - Small nets (20kg): £5-6')
  console.log('    - Large nets (40kg): £7-8')
  console.log('    - Bulk bags (250kg): £110')
  console.log('    - Dumpy bags (1m³): £145')
  console.log('    - Crates (5m³): £650')
  console.log('  • All prices based on current UK firewood market rates\n')
}

updateProducts()
