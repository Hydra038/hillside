const { PrismaClient } = require('@prisma/client');

// Connect directly to Supabase
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Derq@038!@db.fyjmczdbllubrssixpnx.supabase.co:5432/postgres'
    }
  }
});

async function checkSupabaseProducts() {
  try {
    console.log('🔍 Checking Supabase database for products...');
    console.log('🌐 Connecting to: db.fyjmczdbllubrssixpnx.supabase.co');
    
    const count = await prisma.product.count();
    console.log(`✅ Found ${count} products in Supabase database`);
    
    if (count > 0) {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
          isFeatured: true,
          category: true
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 10
      });
      
      console.log('\n📋 Products in Supabase:');
      console.log('=' .repeat(60));
      products.forEach(p => {
        const star = p.isFeatured ? '⭐' : '  ';
        const category = p.category ? `[${p.category}]` : '';
        console.log(`${star} ${p.name} - £${p.price} ${category} (Stock: ${p.stockQuantity})`);
      });
      
      const featuredCount = products.filter(p => p.isFeatured).length;
      console.log('=' .repeat(60));
      console.log(`📊 Summary: ${count} total products, ${featuredCount} featured`);
      
    } else {
      console.log('\n❌ No products found in Supabase database');
      console.log('💡 You need to add products manually:');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Open your project → SQL Editor');
      console.log('   3. Run the SQL from supabase-insert-products.sql');
    }
    
    // Test table structure
    console.log('\n🔧 Testing table structure...');
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    console.log('Products table exists:', tableExists[0]?.exists || false);
    
  } catch (error) {
    console.error('\n❌ Error checking Supabase database:');
    console.error('Message:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🌐 Network Issue:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Supabase is accessible');
    } else if (error.message.includes('authentication') || error.message.includes('password')) {
      console.log('\n🔑 Authentication Issue:');
      console.log('   - Check database credentials');
      console.log('   - Verify password is correct');
    } else if (error.message.includes('does not exist')) {
      console.log('\n🗄️ Database Issue:');
      console.log('   - Table might not exist');
      console.log('   - Run database migrations first');
    } else {
      console.log('\n🔧 Alternative: Check via Supabase Dashboard');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Your project → Table Editor → products');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkSupabaseProducts();