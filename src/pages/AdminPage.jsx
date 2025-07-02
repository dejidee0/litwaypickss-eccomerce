import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Filter, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import { products as initialProducts, categories } from '../data/products'
import { formatCurrency } from '../lib/currency'
import { toast } from 'sonner'
import ProductForm from '../components/admin/ProductForm'
import ProductList from '../components/admin/ProductList'
import AdminStats from '../components/admin/AdminStats'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ]

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: (Math.max(...products.map(p => parseInt(p.id))) + 1).toString(),
      rating: 0,
      reviewCount: 0,
      featured: false,
    }
    setProducts([...products, newProduct])
    setShowProductForm(false)
    toast.success('Product added successfully!')
  }

  const handleUpdateProduct = (productData) => {
    setProducts(products.map(p => 
      p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
    ))
    setEditingProduct(null)
    setShowProductForm(false)
    toast.success('Product updated successfully!')
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
      toast.success('Product deleted successfully!')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="card p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <AdminStats products={products} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Products */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
                    <div className="space-y-3">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center space-x-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Low Stock Alert */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
                    <div className="space-y-3">
                      {products.filter(p => p.stock <= 10).slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {product.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Products Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                    <p className="text-gray-600">{filteredProducts.length} products found</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null)
                      setShowProductForm(true)
                    }}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="card p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="input pl-10"
                        />
                      </div>
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input w-auto"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products List */}
                <ProductList
                  products={filteredProducts}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders</h2>
                <p className="text-gray-600">Order management coming soon...</p>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customers</h2>
                <p className="text-gray-600">Customer management coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}