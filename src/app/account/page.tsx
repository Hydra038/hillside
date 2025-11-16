'use client'

import { useAuth } from '@/lib/auth-provider'
import AccountDetails from './AccountDetails'
import OrderHistory from './OrderHistory'

export default function AccountPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="bg-gray-100 h-64 rounded-lg"></div>
            </div>
            <div className="col-span-2">
              <div className="bg-gray-100 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to view this page.</p>
          <a 
            href="/signin" 
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Section */}
        <div className="col-span-1">
          <AccountDetails />
        </div>

        {/* Orders Section */}
        <div className="col-span-1 md:col-span-2">
          <OrderHistory />
        </div>
      </div>
    </div>
  )
}
