import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'firewood',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return false
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded.role === 'admin'
  } catch (error) {
    return false
  }
}

// GET - Fetch all payment settings (public, show all to user)
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query('SELECT * FROM payment_settings ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    );
  }
}

// POST - Create new payment setting
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('PaymentSettings POST body:', body)
    const { type, display_name, description, enabled, config } = body

    try {
      const [result]: any = await pool.query(
        'INSERT INTO payment_settings (type, display_name, description, enabled, config) VALUES (?, ?, ?, ?, ?)',
        [type, display_name, description, enabled, JSON.stringify(config)]
      )
      const insertId = result.insertId
      const [rows]: any = await pool.query('SELECT * FROM payment_settings WHERE id = ?', [insertId])
      return NextResponse.json(rows[0], { status: 201 })
    } catch (sqlError) {
      console.error('SQL error creating payment setting:', sqlError)
      return NextResponse.json(
        { error: 'SQL error', details: String(sqlError) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating payment setting:', error)
    return NextResponse.json(
      { error: 'Failed to create payment setting', details: String(error) },
      { status: 500 }
    )
  }
}
