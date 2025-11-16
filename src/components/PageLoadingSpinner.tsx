'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageLoadingSpinner() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Show loading spinner briefly on route change
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
        <p className="text-amber-700 font-semibold">Loading...</p>
      </div>
    </div>
  )
}
