console.log('🔍 Environment Variables Check:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'SET' : 'NOT SET')
console.log('')

if (process.env.DATABASE_URL) {
  console.log('📍 Database URL format check:')
  const url = process.env.DATABASE_URL
  console.log('Protocol:', url.startsWith('postgresql://') ? '✅ PostgreSQL' : '❌ Not PostgreSQL')
  console.log('Host includes supabase.co:', url.includes('supabase.co') ? '✅ Yes' : '❌ No')
  console.log('Port 5432:', url.includes(':5432') ? '✅ Yes' : '❌ No')
  console.log('')
  console.log('Full URL (masked password):', url.replace(/:[^:]+@/, ':****@'))
}

// Try a simple ping to the host
console.log('🔍 Testing host connectivity...')
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
})

async function quickTest() {
  try {
    console.log('⏳ Attempting connection...')
    await prisma.$connect()
    console.log('✅ Connected successfully!')
    
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('🕐 Database time:', result)
    
  } catch (error) {
    console.error('❌ Connection failed:')
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      
      if (error.message.includes('timeout')) {
        console.log('\n💡 This appears to be a timeout issue.')
        console.log('Possible causes:')
        console.log('- Supabase project is paused')
        console.log('- Network connectivity issues')
        console.log('- Database is under maintenance')
      }
      
      if (error.message.includes('authentication')) {
        console.log('\n💡 This appears to be an authentication issue.')
        console.log('Check your database password in the connection string.')
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

quickTest()
