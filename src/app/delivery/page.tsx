export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Delivery Information</h1>

      <div className="prose max-w-none">
        <div className="bg-amber-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Coverage</h2>
          <p className="mb-4">
            We deliver our quality firewood logs across the entire UK mainland. Delivery times
            and costs vary by region:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Local delivery (within 20 miles): Next day delivery available</li>
            <li>Regional delivery (up to 100 miles): 2-3 working days</li>
            <li>UK mainland: 3-5 working days</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Process</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Order Confirmation</strong>
              <p>Once your order is placed, you'll receive an email confirmation with your order details.</p>
            </li>
            <li>
              <strong>Delivery Scheduling</strong>
              <p>Our team will contact you to arrange a convenient delivery date and time.</p>
            </li>
            <li>
              <strong>Delivery Day</strong>
              <p>You'll receive a message on the morning of delivery with an estimated time slot.</p>
            </li>
            <li>
              <strong>Placement</strong>
              <p>Our drivers will place the logs in an agreed accessible location on your property.</p>
            </li>
          </ol>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Important Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Please ensure there is adequate access for our delivery vehicle</li>
            <li>Someone must be present to accept the delivery</li>
            <li>Let us know of any specific delivery instructions when ordering</li>
            <li>Minimum order quantities may apply for certain areas</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about delivery to your area, please don't hesitate to 
            contact our Hillside Logs Fuel customer service team:
          </p>
          <div className="bg-amber-50 p-4 rounded-lg">
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="mr-3">📱</span>
                <div>
                  <strong>WhatsApp:</strong> +44 7878 779622
                  <div>
                    <a 
                      href="https://wa.me/447878779622" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 text-sm"
                    >
                      Contact us on WhatsApp for quick delivery queries
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center">
                <span className="mr-3">�</span>
                <div>
                  <strong>Email:</strong> support@firewoodlogsfuel.com
                  <div>
                    <a 
                      href="mailto:support@firewoodlogsfuel.com"
                      className="text-amber-600 hover:text-amber-700 text-sm"
                    >
                      Send us an email for detailed delivery information
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center">
                <span className="mr-3">🕒</span>
                <div>
                  <strong>Business Hours:</strong> Monday-Friday, 9am-5pm
                  <div className="text-sm text-gray-600">
                    We aim to respond to all queries within 24 hours
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
