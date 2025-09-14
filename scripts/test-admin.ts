import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function testAdminSignin() {
  try {
    console.log('Testing admin signin functionality...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // First create an admin user
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';
    
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = ${adminEmail}
    `;
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES (${adminName}, ${adminEmail}, ${hashedPassword}, 'admin')
        RETURNING id, name, email, role
      `;
      console.log('Admin user created:', newAdmin[0]);
    }
    
    console.log('Testing admin signin...');
    
    // Find admin user
    const adminUser = await sql`
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users 
      WHERE email = ${adminEmail}
    `;
    
    if (adminUser.length === 0) {
      throw new Error('Admin user not found');
    }

    const admin = adminUser[0];
    console.log('Admin found:', { id: admin.id, name: admin.name, email: admin.email, role: admin.role });

    // Verify admin role
    if (admin.role !== 'admin') {
      throw new Error('User is not an admin');
    }

    console.log('Verifying admin password...');
    const isValid = await bcrypt.compare(adminPassword, admin.password);
    console.log('Password verification successful:', isValid);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    console.log('Generating JWT token for admin...');
    const token = jwt.sign(
      { 
        userId: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('JWT token generated successfully for admin, length:', token.length);

    // Test token verification
    console.log('Testing admin token verification...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    console.log('Admin token verified successfully:', { userId: decoded.userId, email: decoded.email, role: decoded.role });

    // Verify admin role from token
    if (decoded.role !== 'admin') {
      throw new Error('Token does not contain admin role');
    }

    console.log('✅ All admin signin functionality tests passed!');
    console.log('✅ Admin user can access admin dashboard');
    
  } catch (error) {
    console.error('❌ Admin signin test failed:', error);
  }
}

testAdminSignin();
