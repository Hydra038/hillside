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

      const data = await response.json()

      if (!response.ok) {
        console.error('Delete failed:', data)
        throw new Error(data.error || 'Failed to delete product')
      }

      setProducts(products.filter(p => p.id !== id))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
        body: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          category: updatedProduct.category,
          image_url: updatedProduct.imageUrl,
          stock_quantity: updatedProduct.stockQuantity,
          is_featured: updatedProduct.isFeatured || false,
        }),
      })

      if (!response.ok) throw new Error('Failed to update product')

      const updated = await response.json()
      setProducts(products.map(p => 
        p.id === updated.id ? {
          ...updatedProduct,
          imageUrl: updated.image_url,
          stockQuantity: updated.stock_quantity,
          isFeatured: updated.is_featured,
        } : p
      ))
      setShowEditModal(false)
      setEditingProduct(null)
    } catch (error) {
      alert('Error updating product')
    }
  }

  async function handleToggleFeatured(product: Product) {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_featured: !product.isFeatured,
        }),
      })

      if (!response.ok) throw new Error('Failed to update featured status')

      const updated = await response.json()
      setProducts(products.map(p => 
        p.id === updated.id ? {
          ...p,
          isFeatured: updated.is_featured,
        } : p
      ))
    } catch (error) {
      alert('Error updating featured status')
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
    <div className="space-y-6">
      {/* Enhanced Search and Filter Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of <span className="font-semibold text-gray-900">{products.length}</span> products
            {selectedProducts.size > 0 && (
              <span className="ml-2 text-amber-600 font-semibold">
                ({selectedProducts.size} selected)
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportProducts}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow text-sm font-medium flex items-center gap-2"
            >
              <span>📊</span> Export CSV
            </button>
            {selectedProducts.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow text-sm font-medium flex items-center gap-2"
              >
                <span>🗑</span> Delete ({selectedProducts.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                  onChange={selectAllProducts}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-amber-50/50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {product.imageUrl ? (
                        <img 
                          className="h-14 w-14 rounded-xl object-cover shadow-sm ring-2 ring-gray-100" 
                          src={product.imageUrl} 
                          alt={product.name} 
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{product.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{product.description?.slice(0, 60)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">£{Number(product.price).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`text-sm font-medium ${
                      (product.stockQuantity ?? 0) === 0 
                        ? 'text-red-600' 
                        : (product.stockQuantity ?? 0) < 10 
                        ? 'text-orange-600' 
                        : 'text-green-600'
                    }`}>
                      {product.stockQuantity ?? 0}
                    </div>
                    {(product.stockQuantity ?? 0) === 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Out</span>
                    )}
                    {(product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) < 10 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">Low</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleFeatured(product)}
                    className={`text-2xl transition-all transform hover:scale-125 ${
                      product.isFeatured 
                        ? 'opacity-100' 
                        : 'opacity-30 hover:opacity-60'
                    }`}
                    title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                  >
                    ⭐
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting[product.id]}
                      className={`px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors shadow-sm ${
                        isDeleting[product.id]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isDeleting[product.id] ? '⏳' : '🗑️'} Delete
                    </button>
                  </div>
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

      {/* Products Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4 mr-2"
                  />
                  {product.imageUrl ? (
                    <img 
                      className="h-20 w-20 rounded-lg object-cover shadow-sm ring-2 ring-gray-100" 
                      src={product.imageUrl} 
                      alt={product.name} 
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shadow-sm">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-gray-900">{product.name}</h3>
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      className={`text-xl flex-shrink-0 transition-all transform ${
                        product.isFeatured 
                          ? 'opacity-100 scale-110' 
                          : 'opacity-30 hover:opacity-60'
                      }`}
                      title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      ⭐
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-lg font-bold text-amber-600">£{Number(product.price).toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-medium ${
                        (product.stockQuantity ?? 0) === 0 
                          ? 'text-red-600' 
                          : (product.stockQuantity ?? 0) < 10 
                          ? 'text-orange-600' 
                          : 'text-green-600'
                      }`}>
                        {product.stockQuantity ?? 0} in stock
                      </span>
                      {(product.stockQuantity ?? 0) === 0 && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Out</span>
                      )}
                      {(product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) < 10 && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">Low</span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting[product.id]}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                    isDeleting[product.id]
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isDeleting[product.id] ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-gray-500 font-medium">
              {searchTerm || categoryFilter ? 'No products match your filters' : 'No products found'}
            </div>
            {(searchTerm || categoryFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('')
                }}
                className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear filters
              </button>
            )}
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
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(product.imageUrl || '')
  const [uploadError, setUploadError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB')
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Update form data with new image URL
      const newImageUrl = data.url
      setFormData({ ...formData, imageUrl: newImageUrl })
      setImagePreview(newImageUrl)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setFormData({ ...formData, imageUrl: '' })
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* File Upload */}
              <div className="mb-3">
                <label className="block w-full cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors bg-gray-50 hover:bg-amber-50">
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-2"></div>
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">Click to upload image</span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploadError && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  {uploadError}
                </div>
              )}

              {/* URL Input as Alternative */}
              <div className="text-center text-xs text-gray-500 mb-2">or paste image URL</div>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value })
                  setImagePreview(e.target.value)
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  ⭐ Featured Product (Show on homepage)
                </span>
              </label>
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
