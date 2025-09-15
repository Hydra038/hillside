'use client'

import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import AccountDetails from './AccountDetails'
import OrderHistory from './OrderHistory'
import PasswordChange from './PasswordChange'
import AddressBook from './AddressBook'
import RecentActivity from './RecentActivity'
import SupportChat from './SupportChat'

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <button
          onClick={async () => {
            await signOut()
            router.push('/signin')
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-amber-600 hover:to-amber-800 transition-all font-semibold border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
          <span>Sign Out</span>
        </button>
      </div>

      {/* Welcome message */}
      <div className="mb-8">
        <p className="text-lg text-gray-700">Welcome{user?.name ? `, ${user.name}` : ''}! Here you can manage your account details, orders, and more.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="col-span-1 space-y-8">
          <AccountDetails />
          <PasswordChange />
          <AddressBook />
        </div>

        {/* Orders, Activity & Support Chat Section */}
        <div className="col-span-2 space-y-8">
          <OrderHistory />
          <RecentActivity />
          <SupportChat />
        </div>
      </div>
    </div>
  )
}
