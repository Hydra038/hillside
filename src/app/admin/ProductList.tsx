'use client'

import { useState } from 'react'
import { type Product } from '@/types/product'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products: initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts)
  const [isDeleting, setIsDeleting] = useState<Record<number, boolean>>({})
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setIsDeleting(prev => ({ ...prev, [id]: true }))

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      alert('Error deleting product')
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }))
    }
  }

  async function handleBulkDelete() {
    if (selectedProducts.size === 0) return
    if (!confirm(`Delete ${selectedProducts.size} selected products?`)) return

    try {
      const promises = Array.from(selectedProducts).map(id =>
        fetch(`/api/products/${id}`, { method: 'DELETE' })
      )
      await Promise.all(promises)
      
      setProducts(products.filter(p => !selectedProducts.has(p.id)))
      setSelectedProducts(new Set())
    } catch (error) {
      alert('Error deleting products')
    }
  }

  async function handleEdit(product: Product) {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  async function handleUpdateProduct(updatedProduct: Product) {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) throw new Error('Failed to update product')

      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ))
      setShowEditModal(false)
      setEditingProduct(null)
    } catch (error) {
      alert('Error updating product')
    }
  }

  function toggleProductSelection(id: number) {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedProducts(newSelected)
  }

  function selectAllProducts() {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const exportProducts = () => {
    const csvContent = [
      ['ID', 'Name', 'Price', 'Stock', 'Category', 'Description'].join(','),
      ...filteredProducts.map(product => [
        product.id,
        `"${product.name}"`,
        product.price,
        product.stockQuantity,
        product.category || '',
        `"${product.description || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportProducts}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            📊 Export
          </button>
          {selectedProducts.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              🗑 Delete ({selectedProducts.size})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                  onChange={selectAllProducts}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {product.imageUrl ? (
                        <img className="h-12 w-12 rounded-lg object-cover" src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description?.slice(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">£{Number(product.price).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${(product.stockQuantity ?? 0) < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stockQuantity ?? 0}
                    {(product.stockQuantity ?? 0) < 10 && <span className="ml-1">⚠️</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-amber-600 hover:text-amber-900 mr-4"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting[product.id]}
                  >
                    {isDeleting[product.id] ? '⏳' : '🗑️'} Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm || categoryFilter ? 'No products match your filters' : 'No products found'}
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleUpdateProduct}
          onCancel={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

function EditProductModal({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(product)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
