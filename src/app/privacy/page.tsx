import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-amber-100">
              Your privacy is important to us at Hillside Logs Fuel
            </p>
            <p className="text-amber-200 mt-2">
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
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Hillside Logs Fuel ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
                or use our services for firewood delivery across the UK.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name and contact details (email, phone number)</li>
                    <li>Delivery address and billing information</li>
                    <li>Payment information (processed securely through payment providers)</li>
                    <li>Order history and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Technical Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>IP address and browser information</li>
                    <li>Device type and operating system</li>
                    <li>Website usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Process and fulfill your firewood orders</li>
                <li>Communicate with you about your orders and deliveries</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our website and services</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> Delivery partners, payment processors, and IT support</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of business</li>
                <li><strong>Your Consent:</strong> When you explicitly agree to share information</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, secure servers, 
                and regular security assessments. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                6. Your Rights (UK GDPR)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under UK data protection law, you have the following rights:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Access:</strong> Request copies of your data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Rectification:</strong> Correct inaccurate data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Erasure:</strong> Request deletion of your data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Restriction:</strong> Limit processing of your data</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Portability:</strong> Transfer your data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Object:</strong> Opt out of processing</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Withdraw Consent:</strong> For marketing communications</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span className="text-gray-700"><strong>Complain:</strong> To the ICO if needed</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies to enhance your browsing experience and analyze website traffic. Types of cookies we use:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements (with consent)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookies through your browser settings or our cookie preference center.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                8. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law. 
                Order information is typically retained for 7 years for accounting and legal purposes. You can request earlier deletion 
                of your data subject to our legal obligations.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                9. Contact Us
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about this privacy policy or want to exercise your rights, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-amber-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                    <span>Email: support@firewoodlogsfuel.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-amber-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2Z" />
                    </svg>
                    <span>WhatsApp: +44 7878 779622</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-amber-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                    </svg>
                    <span>Address: United Kingdom</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. 
                Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Back to Home Button */}
            <div className="text-center pt-8 border-t border-gray-200">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
