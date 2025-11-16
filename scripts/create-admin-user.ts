import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user in Supabase...\n')
    
    const adminEmail = 'admin@example.com'
    const adminPassword = 'admin123'
    const adminName = 'Admin User'
    
    // Check if admin already exists
    console.log('📝 Checking if admin user exists...')
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', adminEmail)
    
    if (checkError) {
      console.error('❌ Error checking for existing user:', checkError)
      throw checkError
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('✅ Admin user already exists:', existingUsers[0])
      
      // Update to admin role if not already
      if (existingUsers[0].role !== 'admin') {
        console.log('🔄 Promoting existing user to admin...')
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', existingUsers[0].id)
        
        if (updateError) {
          console.error('❌ Error promoting user:', updateError)
          throw updateError
        }
        console.log('✅ User promoted to admin successfully!')
      }
      
      return
    }
    
    // Create new admin user
    console.log('👤 Creating new admin user...')
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    const { data: newAdmin, error: createError } = await supabase
      .from('users')
      .insert({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      })
      .select()
    
    if (createError) {
      console.error('❌ Error creating admin user:', createError)
      throw createError
    }
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('👑 Role: admin')
    console.log('\n🎉 You can now sign in at /admin/signin')
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
