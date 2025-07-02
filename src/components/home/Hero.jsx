import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Sparkles, Zap, Gift, Star } from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    title: 'Discover Amazing Products',
    subtitle: 'Premium Quality, Unbeatable Prices',
    description: 'Shop the latest trends with free nationwide delivery across all 15 counties in Liberia',
    cta: 'Shop Now',
    ctaSecondary: 'Explore Categories',
    link: '/shop',
    linkSecondary: '/shop',
    image: 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    gradient: 'from-purple-900/80 via-blue-900/70 to-indigo-900/80',
    badge: 'New Arrivals',
    badgeIcon: Sparkles,
    stats: [
      { label: 'Products', value: '5000+' },
      { label: 'Happy Customers', value: '10K+' },
      { label: 'Counties Served', value: '15' }
    ]
  },
  {
    id: 2,
    title: 'Tech Revolution Starts Here',
    subtitle: 'Latest Electronics & Gadgets',
    description: 'From smartphones to smart watches, discover cutting-edge technology with warranty and support',
    cta: 'Browse Electronics',
    ctaSecondary: 'View Deals',
    link: '/shop/electronics',
    linkSecondary: '/shop/electronics',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    gradient: 'from-orange-900/80 via-red-900/70 to-pink-900/80',
    badge: 'Up to 40% Off',
    badgeIcon: Zap,
    stats: [
      { label: 'Tech Products', value: '500+' },
      { label: 'Brands', value: '50+' },
      { label: 'Warranty', value: '2 Years' }
    ]
  },
  {
    id: 3,
    title: 'Fashion Forward',
    subtitle: 'Style That Speaks Volumes',
    description: 'Express your unique personality with our curated collection of trendy clothing and accessories',
    cta: 'Shop Fashion',
    ctaSecondary: 'New Collection',
    link: '/shop/womens',
    linkSecondary: '/shop/mens',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    gradient: 'from-emerald-900/80 via-teal-900/70 to-cyan-900/80',
    badge: 'Trending Now',
    badgeIcon: Star,
    stats: [
      { label: 'Fashion Items', value: '2000+' },
      { label: 'New Weekly', value: '100+' },
      { label: 'Styles', value: 'Unlimited' }
    ]
  },
  {
    id: 4,
    title: 'Home & Lifestyle',
    subtitle: 'Transform Your Living Space',
    description: 'Create the perfect home with our collection of furniture, decor, and lifestyle products',
    cta: 'Shop Home',
    ctaSecondary: 'Garden Collection',
    link: '/shop/home-garden',
    linkSecondary: '/shop/home-garden',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    gradient: 'from-amber-900/80 via-orange-900/70 to-red-900/80',
    badge: 'Free Delivery',
    badgeIcon: Gift,
    stats: [
      { label: 'Home Items', value: '1500+' },
      { label: 'Room Types', value: 'All' },
      { label: 'Delivery', value: 'Free' }
    ]
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrent(prev => (prev + 1) % heroSlides.length)
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setProgress(0)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length)
    setProgress(0)
  }

  const goToSlide = (index) => {
    setCurrent(index)
    setProgress(0)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const currentSlide = heroSlides[current]

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Carousel */}
      <div className="relative h-[600px] md:h-[700px] lg:h-[800px]">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <div className="relative h-full">
              {/* Background Image with Parallax Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                    index === current ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
                <div className="absolute top-40 right-20 w-3 h-3 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-32 left-20 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
                <div className="absolute top-60 right-40 w-2 h-2 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl">
                    {/* Badge */}
                    <div className={`inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 transition-all duration-700 ${
                      index === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`} style={{ transitionDelay: '200ms' }}>
                      <slide.badgeIcon className="h-4 w-4 text-white" />
                      <span className="text-white text-sm font-medium">{slide.badge}</span>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                      <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight transition-all duration-700 ${
                        index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`} style={{ transitionDelay: '400ms' }}>
                        {slide.title}
                      </h1>
                      
                      <h2 className={`text-xl md:text-3xl lg:text-4xl font-medium text-orange-200 transition-all duration-700 ${
                        index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`} style={{ transitionDelay: '600ms' }}>
                        {slide.subtitle}
                      </h2>
                      
                      <p className={`text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed transition-all duration-700 ${
                        index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`} style={{ transitionDelay: '800ms' }}>
                        {slide.description}
                      </p>

                      {/* Stats */}
                      <div className={`flex flex-wrap gap-6 md:gap-8 transition-all duration-700 ${
                        index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`} style={{ transitionDelay: '1000ms' }}>
                        {slide.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-300">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
                        index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`} style={{ transitionDelay: '1200ms' }}>
                        <Link
                          to={slide.link}
                          className="group inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                          <span>{slide.cta}</span>
                          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        
                        <Link
                          to={slide.linkSecondary}
                          className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                        >
                          <span>{slide.ctaSecondary}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 group"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 group"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
            >
              <div className={`w-12 h-2 rounded-full transition-all duration-300 ${
                index === current 
                  ? 'bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}>
                {index === current && (
                  <div 
                    className="h-full bg-primary-400 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Auto-play Control */}
        <button
          onClick={toggleAutoPlay}
          className="absolute bottom-8 right-8 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
        >
          <Play className={`h-4 w-4 text-white transition-transform ${isAutoPlaying ? 'scale-0' : 'scale-100'}`} />
          <div className={`absolute inset-0 flex items-center justify-center transition-transform ${isAutoPlaying ? 'scale-100' : 'scale-0'}`}>
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white rounded-full ml-1" />
          </div>
        </button>
      </div>

      {/* Enhanced Features Cards */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group card p-6 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Free Delivery</h3>
                <p className="text-gray-600">Nationwide shipping at no cost</p>
                <p className="text-sm text-blue-600 font-medium">All 15 counties covered</p>
              </div>
            </div>
          </div>

          <div className="group card p-6 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Secure Shopping</h3>
                <p className="text-gray-600">Safe & secure payments</p>
                <p className="text-sm text-green-600 font-medium">100% protected</p>
              </div>
            </div>
          </div>

          <div className="group card p-6 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Quality Products</h3>
                <p className="text-gray-600">Carefully curated selection</p>
                <p className="text-sm text-purple-600 font-medium">Premium brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}