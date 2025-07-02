import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import ProductCard from '../components/products/ProductCard'
import ProductCardSkeleton from '../components/products/ProductCardSkeleton'
import { products, getProductsByCategory, searchProducts, categories } from '../data/products'

export default function ShopPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    
    // Simulate loading delay
    setTimeout(() => {
      let result = products
      
      if (searchQuery) {
        result = searchProducts(searchQuery)
      } else if (category) {
        result = getProductsByCategory(category)
      }
      
      // Apply filters
      result = result.filter(product => {
        const price = product.salePrice || product.price
        const inPriceRange = price >= priceRange[0] && price <= priceRange[1]
        const inSelectedBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
        return inPriceRange && inSelectedBrands
      })
      
      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
          break
        case 'price-high':
          result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
          break
        case 'rating':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          result.sort((a, b) => b.id - a.id)
          break
        default:
          // Featured first
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      }
      
      setFilteredProducts(result)
      setLoading(false)
    }, 500)
  }, [category, searchQuery, sortBy, priceRange, selectedBrands])

  const brands = [...new Set(products.map(p => p.brand))]
  
  const currentCategory = categories.find(c => c.slug === category)
  const pageTitle = searchQuery 
    ? `Search results for "${searchQuery}"` 
    : currentCategory?.name || 'All Products'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredProducts.length} products found`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-auto"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card p-6 space-y-6">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            
            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>LRD 0</span>
                  <span>LRD {priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            {/* Brands */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand])
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Clear Filters */}
            <button
              onClick={() => {
                setPriceRange([0, 500])
                setSelectedBrands([])
              }}
              className="w-full btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            } gap-6`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            } gap-6`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Grid className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => {
                  setPriceRange([0, 500])
                  setSelectedBrands([])
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}