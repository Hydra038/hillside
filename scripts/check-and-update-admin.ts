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

async function checkAndUpdateAdmin() {
  try {
    const adminEmail = 'support@firewoodlogsfuel.com'
    
    console.log('\n🔍 Checking user:', adminEmail)
    
    // Check if user exists
    const { data: users, error: checkError } = await supabase
      .from('users')
      .select('id, email, role, name, created_at')
      .eq('email', adminEmail)
    
    if (checkError) {
      console.error('❌ Error checking user:', checkError)
      throw checkError
    }
    
    if (!users || users.length === 0) {
      console.log('❌ User not found:', adminEmail)
      console.log('\n💡 Creating new admin user...')
      
      const newPassword = 'admin123' // Default password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          name: 'Support Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        })
        .select()
      
      if (createError) {
        console.error('❌ Error creating user:', createError)
        throw createError
      }
      
      console.log('✅ New admin user created!')
      console.log('📧 Email:', adminEmail)
      console.log('🔑 Password:', newPassword)
      console.log('👑 Role: admin')
      
    } else {
      const user = users[0]
      console.log('\n✅ User found!')
      console.log('ID:', user.id)
      console.log('Email:', user.email)
      console.log('Name:', user.name)
      console.log('Current Role:', user.role)
      console.log('Created:', user.created_at)
      
      if (user.role !== 'admin') {
        console.log('\n🔄 User is not admin. Promoting to admin...')
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', user.id)
        
        if (updateError) {
          console.error('❌ Error promoting user:', updateError)
          throw updateError
        }
        
        console.log('✅ User promoted to admin successfully!')
      } else {
        console.log('\n✅ User already has admin role!')
      }
      
      // Reset password to known value
      console.log('\n� Resetting password to "admin123"...')
      const newPassword = 'admin123'
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      const { error: pwdError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', user.id)
      
      if (pwdError) {
        console.error('❌ Error updating password:', pwdError)
      } else {
        console.log('✅ Password reset to:', newPassword)
      }
    }
    
    console.log('\n🎉 Done! You can now sign in at /admin/signin')
    
  } catch (error) {
    console.error('❌ Failed:', error)
    process.exit(1)
  }
}

checkAndUpdateAdmin()
