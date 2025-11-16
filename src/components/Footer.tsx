import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Top decorative border */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
        
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Brand section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3">
              {/* Logo/Icon */}
              <div className="bg-amber-600 p-2 rounded-full mr-2 sm:mr-3 shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7V10C2 16 6 20.9 12 22C18 20.9 22 16 22 10V7L12 2M12 4.3L20 8.2V10C20 15.05 16.85 19.29 12 20C7.15 19.29 4 15.05 4 10V8.2L12 4.3Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-amber-400 font-heading">Hillside Logs Fuel</h2>
                <p className="text-gray-300 text-xs mt-0.5 sm:mt-1">Premium Quality Firewood</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
            {/* Contact Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-amber-400 font-heading relative">
                Contact Us
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-600"></div>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center group">
                  <div className="bg-gray-700 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 group-hover:bg-amber-600 transition-colors duration-300">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2Z" />
                    </svg>
                  </div>
                  <a href="https://wa.me/447878779622" target="_blank" rel="noopener noreferrer" 
                     className="hover:text-amber-400 transition-colors duration-300 text-xs sm:text-sm break-all">
                    +44 7878 779622
                  </a>
                </li>
                <li className="flex items-center group">
                  <div className="bg-gray-700 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 group-hover:bg-amber-600 transition-colors duration-300">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                  </div>
                  <a href="mailto:support@firewoodlogsfuel.com" 
                     className="hover:text-amber-400 transition-colors duration-300 text-xs sm:text-sm break-all">
                    support@firewoodlogsfuel.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-amber-400 font-heading relative">
                Quick Links
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-600"></div>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {[
                  { href: "/shop", label: "Shop Products" },
                  { href: "/about", label: "About Us" },
                  { href: "/delivery", label: "Delivery Info" },
                  { href: "/contact", label: "Contact" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} 
                          className="hover:text-amber-400 transition-colors duration-300 text-xs sm:text-sm flex items-center group">
                      <svg className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Coverage */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-amber-400 font-heading relative">
                Delivery Coverage
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-600"></div>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                {[
                  { icon: "🇬🇧", text: "UK Mainland" },
                  { icon: "⚡", text: "Next Day Local" },
                  { icon: "🚚", text: "2-3 Days Regional" },
                  { icon: "📦", text: "3-5 Days Nationwide" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 sm:mr-3 text-base sm:text-lg">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-amber-400 font-heading relative">
                Stay Connected
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-600"></div>
              </h3>
              
              {/* Social Links */}
              <div className="space-y-2 sm:space-y-3">
                <a 
                  href="https://www.facebook.com/profile.php?id=61566871931156" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-2 sm:p-3 bg-gray-700 rounded-lg hover:bg-blue-600 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                  </svg>
                  <span className="text-xs sm:text-sm">Follow on Facebook</span>
                </a>
              </div>

              {/* Quality Badge */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-2 sm:p-3 rounded-lg text-center">
                <div className="text-base sm:text-lg mb-0.5 sm:mb-1">🏆</div>
                <div className="text-xs font-semibold">Premium Quality</div>
                <div className="text-xs opacity-90">Sustainably Sourced</div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm">
                © {new Date().getFullYear()} Hillside Logs Fuel. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-amber-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-amber-400 transition-colors duration-300">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
