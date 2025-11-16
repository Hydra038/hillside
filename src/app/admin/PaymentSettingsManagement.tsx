'use client'

import { useState, useEffect } from 'react'

type PaymentMethod = {
  id: number
  type: string
  enabled: boolean
  displayName: string
  description: string
  config: Partial<{
    accountName: string
    accountNumber: string
    sortCode: string
    reference: string
    email: string
    instructions: string
  }>
  created_at: string
  updated_at: string
}

export default function PaymentSettingsManagement() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)

  const [formData, setFormData] = useState({
    type: '',
    displayName: '',
    description: '',
    enabled: true,
    config: {
      accountName: '',
      accountNumber: '',
      sortCode: '',
      reference: '',
      email: '',
      instructions: ''
    }
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/admin/payment-settings')
      if (!response.ok) throw new Error('Failed to fetch payment methods')
      const data = await response.json()
      setPaymentMethods(data)
    } catch (error) {
      setError('Failed to load payment methods')
      console.error('Error fetching payment methods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const url = editingMethod 
        ? `/api/admin/payment-settings/${editingMethod.id}`
        : '/api/admin/payment-settings'
      
      const method = editingMethod ? 'PUT' : 'POST'
      // Map displayName to display_name for backend compatibility
      const { displayName, ...rest } = formData;
      const payload = {
        ...rest,
        display_name: displayName,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        let msg = 'Failed to save payment method'
        try {
          const data = await response.json()
          if (data?.error) msg += `: ${data.error}`
        } catch {}
        setError(msg)
        throw new Error(msg)
      }

      setSuccess(editingMethod ? 'Payment method updated!' : 'Payment method added!')
      setShowAddForm(false)
      setEditingMethod(null)
      resetForm()
      fetchPaymentMethods()
    } catch (error) {
      setError((error as any).message || 'Failed to save payment method')
      console.error('Error saving payment method:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return

    try {
      const response = await fetch(`/api/admin/payment-settings/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete payment method')

      setSuccess('Payment method deleted!')
      fetchPaymentMethods()
    } catch (error) {
      setError('Failed to delete payment method')
      console.error('Error deleting payment method:', error)
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      type: method.type,
      displayName: method.displayName,
      description: method.description,
      enabled: method.enabled,
      config: {
        accountName: method.config.accountName || '',
        accountNumber: method.config.accountNumber || '',
        sortCode: method.config.sortCode || '',
        reference: method.config.reference || '',
        email: method.config.email || '',
        instructions: method.config.instructions || ''
      }
    })
    setShowAddForm(true)
  }

  const toggleEnabled = async (id: number, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/payment-settings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      })

      if (!response.ok) throw new Error('Failed to update payment method')

      fetchPaymentMethods()
    } catch (error) {
      setError('Failed to update payment method')
      console.error('Error updating payment method:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: '',
      displayName: '',
      description: '',
      enabled: true,
      config: {
        accountName: '',
        accountNumber: '',
        sortCode: '',
        reference: '',
        email: '',
        instructions: ''
      }
    })
    setEditingMethod(null)
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading payment settings...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Add New Payment Method Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Payment Method
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="text-lg font-medium mb-4">
            {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select type</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={2}
              />
            </div>

            {/* Bank Transfer specific fields */}
            {formData.type === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={formData.config.accountName}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: {...formData.config, accountName: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.config.accountNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: {...formData.config, accountNumber: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Code
                    </label>
                    <input
                      type="text"
                      value={formData.config.sortCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: {...formData.config, sortCode: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={formData.config.reference}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: {...formData.config, reference: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayPal specific fields */}
            {formData.type === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={formData.config.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: {...formData.config, email: e.target.value}
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                value={formData.config.instructions}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {...formData.config, instructions: e.target.value}
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                placeholder="Instructions for customers on how to use this payment method"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                Enable this payment method
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingMethod ? 'Update' : 'Add'} Payment Method
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payment methods configured yet.</p>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-lg">{method.displayName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      method.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {method.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                  <p className="text-xs text-gray-500">Type: {method.type}</p>
                  
                  {/* Display method-specific details */}
                  {method.type === 'bank_transfer' && method.config && (
                    <div className="mt-2 text-sm text-gray-600">
                      {method.config.accountName && <p>Account: {method.config.accountName}</p>}
                      {method.config.accountNumber && <p>Number: {method.config.accountNumber}</p>}
                      {method.config.sortCode && <p>Sort Code: {method.config.sortCode}</p>}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleEnabled(method.id, !method.enabled)}
                    className={`px-3 py-1 rounded text-sm ${
                      method.enabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {method.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleEdit(method)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
