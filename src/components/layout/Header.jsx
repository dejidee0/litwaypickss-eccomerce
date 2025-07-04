import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Gift,
} from "lucide-react";
import { useCart } from "../../lib/cart-context";
import { useAuth } from "../../lib/auth-context";
import { useLoyalty } from "../../lib/loyalty-context";
import {
  getSearchSuggestions,
  getPopularSearchTerms,
} from "../../data/products";
import LoginModal from "../auth/LoginModal";
import LoyaltyCard from "../Loyalty/LoyaltyCard";

const categories = [
  { name: "Men's", href: "/shop/mens" },
  { name: "Women's", href: "/shop/womens" },
  { name: "Electronics", href: "/shop/electronics" },
  { name: "Accessories", href: "/shop/accessories" },
  { name: "Home & Garden", href: "/shop/home-garden" },
  { name: "Beauty & Personal Care", href: "/shop/beauty" },
  { name: "Sports & Outdoors", href: "/shop/sports" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const { itemsCount, setIsOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { loyaltyData } = useLoyalty();
  const navigate = useNavigate();

  // Get search suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const suggestions = getSearchSuggestions(searchQuery, 8);
      setSearchSuggestions(suggestions);
      setShowSearchSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/shop?search=${encodeURIComponent(searchQuery)}");
      setSearchQuery("");
      setShowSearchSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate("/shop?search=${encodeURIComponent(suggestion)}");
    setShowSearchSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 1) {
      setShowSearchSuggestions(true);
    } else {
      // Show popular search terms when focused with empty query
      setSearchSuggestions(getPopularSearchTerms());
      setShowSearchSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const hasLoyaltyDiscount = loyaltyData?.canUseDiscount;

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Free Nationwide Delivery</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>📞 +231-888-640-502</span>
            <span>💬 WhatsApp Support</span>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 hover:text-primary-200 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            LitwayPicks
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="input pr-10 w-full"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  {searchQuery.trim().length <= 1 && (
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Popular Searches
                    </div>
                  )}
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-sm font-medium">
                        {user?.first_name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    {hasLoyaltyDiscount && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span>Hi, {user?.first_name}</span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {/* Loyalty Card in Dropdown */}
                    {loyaltyData && (
                      <div className="px-4 py-2 border-b">
                        <LoyaltyCard compact={true} />
                      </div>
                    )}

                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Account</span>
                    </Link>

                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to loyalty tab
                        setTimeout(() => {
                          const loyaltyTab = document.querySelector(
                            '[data-tab="loyalty"]'
                          );
                          if (loyaltyTab) loyaltyTab.click();
                        }, 100);
                      }}
                    >
                      <Gift className="h-4 w-4" />
                      <span>Loyalty Points</span>
                      {hasLoyaltyDiscount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                          50% OFF!
                        </span>
                      )}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden md:flex items-center text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary-600 text-white text-xs rounded-full">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-4 md:hidden relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="input pr-10 w-full"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Mobile Search Suggestions */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
              <div className="p-2">
                {searchQuery.trim().length <= 1 && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Popular Searches
                  </div>
                )}
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-8 py-3">
            <Link
              to="/"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Shop
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.href}
                to={category.href}
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/about"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-slide-up">
              <Link
                to="/"
                className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <div className="space-y-2">
                <p className="font-medium text-gray-700">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    to={category.href}
                    className="block pl-4 text-gray-600 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link
                to="/about"
                className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 text-sm font-medium">
                          {user?.first_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span>Hi, {user?.first_name}</span>
                      {hasLoyaltyDiscount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          50% OFF!
                        </span>
                      )}
                    </div>
                    <Link
                      to="/account"
                      className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Sign In / Sign Up
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
