'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyPendingPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const resendVerification = async () => {
    if (!email) {
      setMessage('No email address provided.')
      setResendStatus('error')
      return
    }

    setResendStatus('sending')
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendStatus('sent')
        setMessage('A new verification email has been sent! Please check your inbox.')
      } else {
        setResendStatus('error')
        setMessage(data.error || 'Failed to resend verification email.')
      }
    } catch (error) {
      setResendStatus('error')
      setMessage('An error occurred while resending the verification email.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-gray-900 to-orange-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-md w-full space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-600 p-3 rounded-full shadow-2xl mr-3">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white font-heading">
                Check Your Email
              </h1>
              <p className="text-amber-300 text-xs mt-1">Firewood Logs Fuel</p>
            </div>
          </div>
        </div>

        {/* Verification Pending Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">Email Verification Required</h2>
            
            <div className="text-gray-300 mb-6 space-y-2">
              <p>We've sent a verification email to:</p>
              {email && (
                <p className="text-amber-300 font-medium break-all">{email}</p>
              )}
              <p className="text-sm">Please check your inbox and click the verification link to activate your account.</p>
            </div>

            {/* Resend verification section */}
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                <p>Didn't receive the email? Check your spam folder or</p>
              </div>
              
              {resendStatus === 'sent' && (
                <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">{message}</p>
                </div>
              )}
              
              {resendStatus === 'error' && (
                <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{message}</p>
                </div>
              )}

              <button 
                onClick={resendVerification}
                disabled={resendStatus === 'sending' || resendStatus === 'sent' || !email}
                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {resendStatus === 'sending' ? 'Sending...' : 
                 resendStatus === 'sent' ? 'Email Sent!' : 
                 'Resend Verification Email'}
              </button>
              
              <div className="flex space-x-3">
                <Link 
                  href="/signin"
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Back to Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Sign Up Again
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            Having trouble? <Link href="/contact" className="text-amber-300 hover:text-amber-200">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  )
}