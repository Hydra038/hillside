'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'

interface PaymentMethod {
  id: number
  type: string
  display_name: string
  description: string
  enabled: boolean
  config: {
    email?: string
    sortCode?: string
    accountNumber?: string
    accountName?: string
    instructions?: string
    reference?: string
  }
}

export default function PaymentSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/admin')
      return
    }
    fetchPaymentMethods()
  }, [user])

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch('/api/admin/payment-settings')
      if (!res.ok) throw new Error('Failed to fetch payment methods')
      const data = await res.json()
      setPaymentMethods(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load payment methods')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEnabled = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: !currentStatus })
      })

      if (!res.ok) throw new Error('Failed to update')
      
      setSuccess('Payment method updated successfully')
      setTimeout(() => setSuccess(''), 3000)
      fetchPaymentMethods()
    } catch (err) {
      setError('Failed to update payment method')
    }
  }

  const saveMethod = async (method: PaymentMethod) => {
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method)
      })

      if (!res.ok) throw new Error('Failed to save')
      
      setSuccess('Payment method saved successfully')
      setTimeout(() => setSuccess(''), 3000)
      setEditingMethod(null)
      fetchPaymentMethods()
    } catch (err) {
      setError('Failed to save payment method')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment Settings</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Manage Payment Methods</h2>
            <p className="text-gray-600 mt-2">Enable/disable and configure payment options for customers</p>
          </div>

          <div className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-6">
                {editingMethod?.id === method.id ? (
                  <EditMethodForm
                    method={editingMethod}
                    onSave={saveMethod}
                    onCancel={() => setEditingMethod(null)}
                    onChange={setEditingMethod}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{method.display_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          method.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {method.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{method.description}</p>
                      
                      {method.type === 'bank_transfer' && method.config && (
                        <div className="bg-gray-50 p-4 rounded text-sm space-y-1">
                          <p><strong>Account Name:</strong> {method.config.accountName}</p>
                          <p><strong>Sort Code:</strong> {method.config.sortCode}</p>
                          <p><strong>Account Number:</strong> {method.config.accountNumber}</p>
                          {method.config.reference && <p><strong>Reference:</strong> {method.config.reference}</p>}
                          {method.config.instructions && <p className="mt-2 text-gray-600">{method.config.instructions}</p>}
                        </div>
                      )}
                      
                      {method.type === 'paypal' && method.config && (
                        <div className="bg-blue-50 p-4 rounded text-sm space-y-1">
                          <p><strong>PayPal Email:</strong> {method.config.email}</p>
                          <p className="mt-2 text-gray-600"><strong>Instructions:</strong> {method.config.instructions}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingMethod(method)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleEnabled(method.id, method.enabled)}
                        className={`px-4 py-2 rounded transition ${
                          method.enabled
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {method.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EditMethodForm({ 
  method, 
  onSave, 
  onCancel,
  onChange 
}: { 
  method: PaymentMethod
  onSave: (method: PaymentMethod) => void
  onCancel: () => void
  onChange: (method: PaymentMethod) => void
}) {
  const [formData, setFormData] = useState(method)

  const updateConfig = (key: string, value: string) => {
    const updated = {
      ...formData,
      config: { ...formData.config, [key]: value }
    }
    setFormData(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
        <input
          type="text"
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {method.type === 'bank_transfer' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            <input
              type="text"
              value={formData.config.accountName || ''}
              onChange={(e) => updateConfig('accountName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Code</label>
              <input
                type="text"
                value={formData.config.sortCode || ''}
                onChange={(e) => updateConfig('sortCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.config.accountNumber || ''}
                onChange={(e) => updateConfig('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference/Notes</label>
            <input
              type="text"
              value={formData.config.reference || ''}
              onChange={(e) => updateConfig('reference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </>
      )}

      {method.type === 'paypal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
          <input
            type="email"
            value={formData.config.email || ''}
            onChange={(e) => updateConfig('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions for Customers</label>
        <textarea
          value={formData.config.instructions || ''}
          onChange={(e) => updateConfig('instructions', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter instructions for customers using this payment method..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
