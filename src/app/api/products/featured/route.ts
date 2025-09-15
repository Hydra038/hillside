import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'firewood',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export async function GET() {
  try {
  const [rows]: any = await pool.query('SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC LIMIT 3')
    // Map snake_case DB fields to camelCase for frontend compatibility
    const mappedRows = rows.map((row: any) => ({
      ...row,
      imageUrl: row.image_url,
      stockQuantity: row.stock_quantity,
      isFeatured: row.is_featured,
      createdAt: row.created_at,
      // Optionally remove snake_case fields if not needed
    }));
    return NextResponse.json(mappedRows)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 })
  }
}
