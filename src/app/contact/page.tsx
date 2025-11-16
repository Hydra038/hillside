export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="prose max-w-none mb-8">
            <p className="text-lg">
              Have questions about our firewood products or delivery service? 
              We're here to help! Get in touch with us using any of the methods below.
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-3">📞</span>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p>+44 7878 779622</p>
                  <p className="text-sm text-gray-600">Monday-Friday: 9am-5pm</p>
                  <a 
                    href="https://wa.me/447878779622" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    Contact us on WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📧</span>
                <div>
                  <p className="font-semibold">Email</p>
                  <p>support@firewoodlogsfuel.com</p>
                  <a 
                    href="mailto:support@firewoodlogsfuel.com"
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    Send us an email
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📍</span>
                <div>
                  <p className="font-semibold">Service Area</p>
                  <p>Premium firewood delivery across the UK</p>
                  <p className="text-sm text-gray-600">Contact us for delivery to your area</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📱</span>
                <div>
                  <p className="font-semibold">Follow Us</p>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61566871931156"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    Follow us on Facebook
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <form className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
