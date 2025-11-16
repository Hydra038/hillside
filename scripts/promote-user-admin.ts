import { db } from '../src/lib/db'
import { users } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

async function promoteUserToAdmin() {
  try {
    console.log('Promoting user to admin...')
    
    // Find user by email (the one you're signed in with)
    const userEmail = 'vicyber038@gmail.com' // Your actual email
    
    console.log(`Looking for user with email: ${userEmail}`)
    
    const user = await db.select().from(users).where(eq(users.email, userEmail)).limit(1)
    
    if (user.length === 0) {
      console.log('User not found. Available users:')
      const allUsers = await db.select({
        email: users.email,
        name: users.name,
        role: users.role
      }).from(users)
      console.log(allUsers)
      return
    }
    
    console.log('Found user:', {
      name: user[0].name,
      email: user[0].email,
      currentRole: user[0].role
    })
    
    if (user[0].role === 'admin') {
      console.log('User is already an admin!')
      return
    }
    
    // Update user role to admin
    console.log('Updating user role to admin...')
    const updatedUser = await db
      .update(users)
      .set({ 
        role: 'admin',
        updatedAt: new Date()
      })
      .where(eq(users.email, userEmail))
      .returning()
    
    console.log('✅ User promoted to admin successfully!')
    console.log('Updated user:', {
      name: updatedUser[0].name,
      email: updatedUser[0].email,
      role: updatedUser[0].role
    })
    
    console.log('\nYou can now access the admin page at: http://localhost:3000/admin')
    
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error)
  }
}

promoteUserToAdmin()
