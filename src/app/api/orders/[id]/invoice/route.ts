import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { orders, orderItems, products, users } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { generateInvoiceHTML, InvoiceData } from '@/lib/invoice-generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to fix Next.js 15 compatibility
    const { id } = await params;
    
    // Verify user authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };
    } catch (jwtErr) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get order details with user and order items
    const orderQuery = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        total: orders.total,
        status: orders.status,
        shippingAddress: orders.shippingAddress,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id))
      .limit(1);

    if (orderQuery.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderQuery[0];

    // Check if user owns this order (or is admin)
    if (decoded.role !== 'admin' && order.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Access denied - not your order' },
        { status: 403 }
      );
    }

    // Only allow invoice download for shipped or delivered orders
    if (order.status !== 'shipped' && order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Invoice not available - order not yet shipped' },
        { status: 400 }
      );
    }

    // Get order items with product details
    const orderItemsQuery = await db
      .select({
        quantity: orderItems.quantity,
        priceAtTime: orderItems.priceAtTime,
        productName: products.name,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    // Parse shipping address
    let shippingAddress;
    try {
      shippingAddress = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress;
    } catch {
      shippingAddress = {
        street: 'Address not available',
        city: '',
        postcode: '',
        country: 'UK'
      };
    }

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      orderId: order.id.slice(0, 8),
      orderDate: new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      customerName: order.userName || 'Valued Customer',
      customerEmail: order.userEmail || '',
      shippingAddress: {
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        postcode: shippingAddress.postcode || '',
        country: shippingAddress.country || 'UK'
      },
      items: orderItemsQuery.map(item => ({
        name: item.productName || 'Product',
        quantity: item.quantity,
        unitPrice: Number(item.priceAtTime || 0).toFixed(2),
        total: (Number(item.priceAtTime || 0) * item.quantity).toFixed(2)
      })),
      subtotal: Number(order.total).toFixed(2),
      total: Number(order.total).toFixed(2),
      paymentMethod: order.paymentMethod || undefined,
      notes: 'Thank you for your business!'
    };

    // Generate HTML invoice (can be converted to PDF client-side)
    const invoiceHTML = generateInvoiceHTML(invoiceData);

    // Return HTML invoice that can be printed or converted to PDF
    return new NextResponse(invoiceHTML, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoiceData.orderId}.html"`,
      },
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
