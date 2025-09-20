import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
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
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns this order (or is admin)
    if (decoded.role.toLowerCase() !== 'admin' && order.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Access denied - not your order' },
        { status: 403 }
      );
    }

    // Only allow invoice download for shipped or delivered orders
    if (order.status !== 'SHIPPED' && order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Invoice not available - order not yet shipped' },
        { status: 400 }
      );
    }

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
      customerName: order.user?.name || 'Valued Customer',
      customerEmail: order.user?.email || '',
      shippingAddress: {
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        postcode: shippingAddress.postcode || '',
        country: shippingAddress.country || 'UK'
      },
      items: order.orderItems.map(item => ({
        name: item.product?.name || 'Product',
        quantity: item.quantity,
        unitPrice: Number(item.priceAtTime || 0).toFixed(2),
        total: (Number(item.priceAtTime || 0) * item.quantity).toFixed(2)
      })),
      subtotal: Number(order.total).toFixed(2),
      total: Number(order.total).toFixed(2),
      paymentMethod: order.paymentMethod || undefined,
      paymentPlan: order.paymentPlan || undefined,
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
