'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import Cart from './Cart'
import { useCartStore } from '@/lib/stores/cart-store'
import { useAuth } from '@/lib/auth-provider'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCartStore()
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  // Hide regular user menu items and account links on admin pages
  const isAdminPage = pathname?.startsWith('/admin')
  const showRegularNavItems = !isAdminPage

  // Function to determine if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname?.startsWith(href)) return true
    return false
  }

  // Get mobile link classes based on active state
  const getMobileLinkClasses = (href: string) => {
    const baseClasses = "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
    if (isActiveLink(href)) {
      return `${baseClasses} text-amber-600 bg-amber-50 font-semibold`
    }
    return `${baseClasses} text-gray-700 hover:text-amber-600 hover:bg-gray-50`
  }

  // Get desktop link classes based on active state
  const getLinkClasses = (href: string) => {
    const baseClasses = "transition-colors duration-200"
    if (isActiveLink(href)) {
      return `${baseClasses} text-amber-600 font-semibold border-b-2 border-amber-600 pb-1`
    }
    return `${baseClasses} text-gray-700 hover:text-amber-600 hover:border-b-2 hover:border-amber-300 pb-1`
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Main Navigation */}
          {showRegularNavItems && (
            <div className="hidden md:flex space-x-8">
              <Link href="/shop" className={getLinkClasses('/shop')}>
                Shop
              </Link>
              <Link href="/about" className={getLinkClasses('/about')}>
                About
              </Link>
              <Link href="/delivery" className={getLinkClasses('/delivery')}>
                Delivery
              </Link>
              <Link href="/contact" className={getLinkClasses('/contact')}>
                Contact
              </Link>
            </div>
          )}

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {showRegularNavItems && (
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative text-gray-700 hover:text-amber-600 flex items-center space-x-2 bg-gray-50 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2 2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-2 text-lg font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-full shadow-sm border border-amber-200">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Welcome, {user.name}!
                </span>
                {/* Hide My Account link on admin pages */}
                {!isAdminPage && (
                  <Link 
                    href="/account" 
                    className="text-amber-600 hover:text-amber-700 font-medium px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 transition"
                  >
                    My Account
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-purple-600 hover:text-purple-700 font-medium px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white px-5 py-2 rounded-full shadow hover:scale-105 hover:from-amber-600 hover:to-amber-800 transition-all font-semibold border-2 border-amber-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/signin" 
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
          {showRegularNavItems && <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600 hover:bg-gray-100"
            >
              <span className="sr-only">Open menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {showRegularNavItems && (
                <>
                  <Link
                    href="/shop"
                    className={getMobileLinkClasses('/shop')}
                  >
                    Shop
                  </Link>
                  <Link
                    href="/about"
                    className={getMobileLinkClasses('/about')}
                  >
                    About
                  </Link>
                  <Link
                    href="/delivery"
                    className={getMobileLinkClasses('/delivery')}
                  >
                    Delivery
                  </Link>
                  <Link
                    href="/contact"
                    className={getMobileLinkClasses('/contact')}
                  >
                    Contact
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="flex w-full items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                  >
                    <div className="relative">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2 2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                          {cartItemCount}
                        </span>
                      )}
                    </div>
                    <span>Shopping Cart</span>
                  </button>
                </>
              )}
              {user ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    Welcome, {user.name}!
                  </div>
                  <Link
                    href="/account"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                  >
                    My Account
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-gray-50"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
