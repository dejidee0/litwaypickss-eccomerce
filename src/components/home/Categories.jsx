import React from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/products'

export default function Categories() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of product categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.slug} to={`/shop/${category.slug}`}>
            <div className="group cursor-pointer overflow-hidden card-elevated border-0 bg-white hover:bg-gradient-to-br hover:from-primary-50 hover:to-orange-50 transition-all duration-500">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-primary-900/70 group-hover:via-primary-600/30 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="font-bold text-lg md:text-xl text-center mb-2 drop-shadow-lg">
                    {category.name}
                  </h3>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                    <p className="text-sm font-medium">
                      {category.itemCount} items
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}