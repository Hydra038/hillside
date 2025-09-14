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

// PUT - Update payment setting
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, displayName, description, enabled, config } = body;
    const params = await context.params;
    const id = params.id;

    const [updateResult]: any = await pool.query(
      `UPDATE payment_settings SET type = ?, display_name = ?, description = ?, enabled = ?, config = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [type || null, displayName || null, description || null, enabled !== undefined ? enabled : null, config ? JSON.stringify(config) : null, id]
    );
    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: 'Payment setting not found' }, { status: 404 });
    }
    // Fetch the updated row
    const [rows]: any = await pool.query('SELECT * FROM payment_settings WHERE id = ?', [id]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating payment setting:', error);
    return NextResponse.json(
      { error: 'Failed to update payment setting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment setting
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    const [result]: any = await pool.query(
      `DELETE FROM payment_settings WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Payment setting not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Payment setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment setting' },
      { status: 500 }
    );
  }
}
