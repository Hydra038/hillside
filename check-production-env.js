// Production Environment Diagnostic Tool
console.log('=== PRODUCTION ENVIRONMENT DIAGNOSTIC ===\n')

// Check critical environment variables
console.log('Environment Variables:')
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ MISSING')
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING')
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('- NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'undefined')

// Test database connection
console.log('\n=== DATABASE CONNECTION TEST ===')
try {
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  prisma.$connect()
    .then(() => {
      console.log('✅ Prisma connection successful')
      return prisma.user.count()
    })
    .then((count) => {
      console.log(`✅ Database query successful - ${count} users found`)
      process.exit(0)
    })
    .catch((error) => {
      console.log('❌ Database connection failed:', error.message)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
} catch (error) {
  console.log('❌ Prisma Client Error:', error.message)
  process.exit(1)
}