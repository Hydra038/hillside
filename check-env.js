require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('===============================');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.JWT_SECRET) {
    console.log('\n⚠️  JWT_SECRET is missing!');
    console.log('Add this to your .env.local file:');
    console.log('JWT_SECRET=your-secret-key-here');
} else {
    console.log('\n✅ All required environment variables are present');
}