import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Code, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-400">LitwayPicks</h3>
            <p className="text-gray-300">
              Liberia's premier e-commerce platform offering quality products with free nationwide delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/shop" className="block text-gray-300 hover:text-white transition-colors">
                Shop
              </Link>
              <Link to="/track-order" className="block text-gray-300 hover:text-white transition-colors">
                Track Order
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <div className="space-y-2">
              <Link to="/shipping" className="block text-gray-300 hover:text-white transition-colors">
                Shipping & Delivery
              </Link>
              <Link to="/returns" className="block text-gray-300 hover:text-white transition-colors">
                Return & Refund
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+231-888-640-502</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">support@litwaypicks.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-400 mt-1" />
                <span className="text-gray-300">
                  Monrovia, Liberia<br />
                  Serving nationwide
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Attribution Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary-400 mr-2" />
              <h4 className="text-lg font-semibold text-white">Built With ❤️ By</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              {/* CodeWithMonk */}
              <div className="space-y-2">
                <a 
                  href="https://www.codewithmonk.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <span className="font-semibold text-lg">CodeWithMonk.com</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-gray-400 text-sm">Professional Web Development</p>
              </div>

              {/* TechBro Mike */}
              <div className="space-y-2">
                <a 
                  href="http://www.instagram.com/techbro.mike" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="font-semibold text-lg">@techbro.mike</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-gray-400 text-sm">Programmer & Tech Enthusiast</p>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                🚀 Crafted with modern technologies and attention to detail
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 LitwayPicks. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Secure payments</span>
            <span className="text-gray-400 text-sm">Free delivery</span>
            <span className="text-gray-400 text-sm">24/7 support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}