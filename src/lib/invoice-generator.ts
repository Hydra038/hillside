// Invoice generation using HTML/CSS for PDF conversion
// This approach works without external dependencies

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }>;
  subtotal: string;
  tax?: string;
  total: string;
  paymentMethod?: string;
  paymentPlan?: string;
  notes?: string;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${data.orderId} - Hillside Logs Fuel</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
        }
        
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #d97706;
        }
        
        .company-info {
          flex: 1;
        }
        
        .company-info h1 {
          color: #d97706;
          font-size: 28px;
          margin: 0 0 10px 0;
          font-weight: bold;
        }
        
        .company-info p {
          margin: 5px 0;
          color: #666;
        }
        
        .invoice-details {
          text-align: right;
          flex: 1;
        }
        
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          color: #333;
          margin: 0 0 10px 0;
        }
        
        .invoice-meta {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .invoice-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .customer-section h3,
        .billing-section h3 {
          color: #d97706;
          margin: 0 0 10px 0;
          font-size: 16px;
          font-weight: bold;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .items-table th {
          background: #d97706;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        
        .items-table tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .totals-section {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
        }
        
        .totals-table {
          width: 300px;
          border-collapse: collapse;
        }
        
        .totals-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
        }
        
        .totals-table .total-row {
          background: #d97706;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        
        .status-badge {
          background: #28a745;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-top: 10px;
        }
        
        .print-button {
          background: #d97706;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .print-button:hover {
          background: #b45309;
        }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">🖨️ Print Invoice</button>
      
      <div class="invoice-header">
        <div class="company-info">
          <h1>🔥 Hillside Logs Fuel</h1>
          <p><strong>Premium Firewood Delivery</strong></p>
          <p>� WhatsApp: +44 7878 779622</p>
          <p>� support@firewoodlogsfuel.com</p>
          <p>� Monday-Friday: 9am-5pm</p>
          <p>🌐 Premium firewood delivery across the UK</p>
        </div>
        <div class="invoice-details">
          <div class="invoice-title">INVOICE</div>
          <p><strong>Invoice #:</strong> ${data.orderId}</p>
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Order Date:</strong> ${data.orderDate}</p>
          <div class="status-badge">✅ SHIPPED</div>
        </div>
      </div>
      
      <div class="invoice-meta">
        <div class="invoice-meta-grid">
          <div class="customer-section">
            <h3>📋 Bill To:</h3>
            <p><strong>${data.customerName}</strong></p>
            <p>${data.customerEmail}</p>
          </div>
          <div class="billing-section">
            <h3>🚚 Ship To:</h3>
            <p>${data.shippingAddress.street}</p>
            <p>${data.shippingAddress.city}</p>
            <p>${data.shippingAddress.postcode}</p>
            <p>${data.shippingAddress.country}</p>
            ${data.paymentMethod ? `<p><strong>Payment Method:</strong> ${data.paymentMethod}</p>` : ''}
            ${data.paymentPlan ? `<p><strong>Payment Plan:</strong> ${data.paymentPlan === 'full' ? 'Full Payment' : data.paymentPlan === 'half' ? 'Split Payment (50% upfront)' : data.paymentPlan}</p>` : ''}
          </div>
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-center">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">£${item.unitPrice}</td>
              <td class="text-right">£${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals-section">
        <table class="totals-table">
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td class="text-right">£${data.subtotal}</td>
          </tr>
          ${data.tax ? `
          <tr>
            <td><strong>VAT:</strong></td>
            <td class="text-right">£${data.tax}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td><strong>TOTAL:</strong></td>
            <td class="text-right">£${data.total}</td>
          </tr>
        </table>
      </div>
      
      ${data.notes ? `
      <div style="margin-top: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3 style="color: #d97706; margin-top: 0;">💭 Notes:</h3>
        <p>${data.notes}</p>
      </div>
      ` : ''}
      
      <div class="footer">
        <p><strong>Thank you for your business!</strong></p>
        <p>For support, contact us at support@firewoodlogsfuel.com or WhatsApp +44 7878 779622</p>
        <p>© 2025 Hillside Logs Fuel. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

// For now, return HTML instead of PDF
// In production, you could use a service like Puppeteer to convert HTML to PDF
export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  // For now, we'll return the HTML as a simple text-based "PDF"
  // In production, integrate with Puppeteer or similar for true PDF generation
  const html = generateInvoiceHTML(data);
  const encoder = new TextEncoder();
  return encoder.encode(html);
}
