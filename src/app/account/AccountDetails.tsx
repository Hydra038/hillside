'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'

export default function AccountDetails() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setMessage('') // Clear any messages when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Refresh user data in the auth context
      await refreshUser()
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Account Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-amber-600 hover:text-amber-700"
          disabled={isUpdating}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="mt-1">{user?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1">{user?.email || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Account Type</label>
            <p className="mt-1 capitalize">{user?.role || 'Customer'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
