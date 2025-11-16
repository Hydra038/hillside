import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300">
              Terms and conditions for Hillside Logs Fuel services
            </p>
            <p className="text-gray-400 mt-2">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Hillside Logs Fuel website and services, you accept and agree to be bound by 
                the terms and provision of this agreement. These Terms of Service ("Terms") govern your use of our website, 
                products, and services related to firewood sales and delivery throughout the United Kingdom.
              </p>
            </section>

            {/* Company Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                2. Company Information
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4"><strong>Business Name:</strong> Hillside Logs Fuel</p>
                <p className="text-gray-700 mb-4"><strong>Services:</strong> Premium firewood sales and delivery</p>
                <p className="text-gray-700 mb-4"><strong>Contact:</strong> support@firewoodlogsfuel.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +44 7878 779622</p>
              </div>
            </section>

            {/* Products and Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                3. Products and Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Product Description
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Seasoned hardwood logs for domestic burning</li>
                    <li>Mixed hardwood varieties including ash, oak, and birch</li>
                    <li>Kiln-dried logs with moisture content below 20%</li>
                    <li>Various quantities from nets to bulk loads</li>
                    <li>Sustainable sourcing from managed UK forests</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Service Standards
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Professional delivery service across the UK</li>
                    <li>Quality guarantee on all products</li>
                    <li>Customer support via phone, email, and WhatsApp</li>
                    <li>Secure online ordering and payment processing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Orders and Payment */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                4. Orders and Payment
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Order Process
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>All orders are subject to acceptance and product availability</li>
                    <li>Order confirmation will be sent via email</li>
                    <li>We reserve the right to refuse or cancel orders at our discretion</li>
                    <li>Bulk orders may require additional verification</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Payment Terms
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Payment is due at the time of order placement</li>
                    <li>We accept major credit/debit cards and PayPal</li>
                    <li>All prices include VAT where applicable</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Failed payments may result in order cancellation</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                5. Delivery Terms
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Delivery Schedule
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Local areas: Next working day</li>
                    <li>Regional: 2-3 working days</li>
                    <li>Nationwide: 3-5 working days</li>
                    <li>Delivery times: 8 AM - 6 PM</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Delivery Requirements
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Accessible delivery location required</li>
                    <li>Customer or representative must be present</li>
                    <li>Additional charges for difficult access</li>
                    <li>Weather conditions may affect delivery</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-gray-700">
                  <strong>Important:</strong> Delivery charges are calculated based on location and order size. 
                  If access is restricted or additional services are required, extra charges may apply.
                </p>
              </div>
            </section>

            {/* Returns and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                6. Returns and Refunds
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Quality Guarantee
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We guarantee the quality of our firewood. If you are not satisfied with your purchase due to quality issues, 
                    please contact us within 48 hours of delivery for a resolution.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Refund Policy
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Refunds available for undelivered or significantly substandard products</li>
                    <li>Cancellations before dispatch: full refund</li>
                    <li>Cancellations after dispatch: subject to delivery costs</li>
                    <li>Refunds processed within 5-10 business days</li>
                    <li>Quality claims require photographic evidence</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Liability and Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                7. Liability and Disclaimers
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Limitation of Liability
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our liability is limited to the value of the goods supplied. We are not responsible for any indirect, 
                    consequential, or incidental damages arising from the use of our products or services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Product Safety
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Firewood is for burning in appropriate appliances only</li>
                    <li>Customers must follow fire safety guidelines</li>
                    <li>Proper ventilation required for all burning appliances</li>
                    <li>We recommend professional chimney cleaning annually</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Customer Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                8. Customer Responsibilities
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate delivery information and contact details</li>
                <li>Ensure someone is available to receive delivery</li>
                <li>Inspect goods upon delivery and report issues promptly</li>
                <li>Store firewood in a dry, well-ventilated area</li>
                <li>Use products safely and in accordance with manufacturer guidelines</li>
                <li>Comply with local regulations regarding wood burning</li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                9. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our 
                <Link href="/privacy" className="text-amber-600 hover:text-amber-700 font-semibold"> Privacy Policy</Link>, 
                which forms part of these Terms. By using our services, you consent to the collection and use of 
                information as outlined in our Privacy Policy.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                10. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of 
                Hillside Logs Fuel and is protected by copyright and other intellectual property laws. You may not reproduce, 
                distribute, or create derivative works without our written permission.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of England and Wales. 
                Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. 
                Your continued use of our services after changes are posted constitutes acceptance of the modified Terms. 
                We recommend reviewing these Terms periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                13. Contact Information
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                    <span>Email: support@firewoodlogsfuel.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2Z" />
                    </svg>
                    <span>WhatsApp: +44 7878 779622</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-200">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              <Link 
                href="/privacy" 
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
