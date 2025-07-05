import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
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
  { name: "Groceries", href: "/shop/groceries" },
  { name: "Beauty & Personal Care", href: "/shop/beauty" },
  { name: "Sports & Outdoors", href: "/shop/sports" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const { itemsCount, setIsOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { loyaltyData } = useLoyalty();
  const navigate = useNavigate();

  const hasLoyaltyDiscount = loyaltyData?.canUseDiscount;

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchSuggestions(getSearchSuggestions(searchQuery, 8));
      setShowSearchSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/shop?search=${encodeURIComponent(suggestion)}`);
    setShowSearchSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 1) {
      setShowSearchSuggestions(true);
    } else {
      setSearchSuggestions(getPopularSearchTerms());
      setShowSearchSuggestions(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Free Nationwide Delivery</span>
          </div>
          <div className="hidden md:flex gap-4">
            <span>📞 +231-888-640-502</span>
            <span>💬 WhatsApp Support</span>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 hover:text-primary-200"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo */}
        <div className="flex justify-between ">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            LitwayPicks
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 pt-2 flex md:hidden hover:text-primary-600"
          >
            Contact
          </Link>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-lg mx-auto">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={() =>
                  setTimeout(() => setShowSearchSuggestions(false), 200)
                }
                className="input pr-10 w-full"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center bg-primary-600 text-white rounded"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          {showSearchSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
              <div className="p-2">
                {searchQuery.trim().length <= 1 && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                    Popular Searches
                  </div>
                )}
                {searchSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">
                    {user?.first_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span>Hi, {user?.first_name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border rounded shadow-lg z-50">
                  {loyaltyData && (
                    <div className="border-b px-4 py-2">
                      <LoyaltyCard compact />
                    </div>
                  )}
                  <Link
                    to="/account"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    Wishlist
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-gray-700 hover:text-primary-600"
            >
              <User className="h-5 w-5" />
            </button>
          )}

          <Link
            to="/wishlist"
            className="text-gray-700 hover:text-primary-600 hidden sm:inline"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative text-gray-700 hover:text-primary-600"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Always-visible Nav Links */}
      <nav className="border-t  overflow-x-auto scrollbar-hide bg-white">
        <div className="flex items-center space-x-6 px-4 py-3 text-sm font-medium whitespace-nowrap">
          <Link to="/" className="text-gray-700 hover:text-primary-600">
            Home
          </Link>
          <Link to="/shop" className="text-gray-700 hover:text-primary-600">
            Shop
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className="text-gray-700 hover:text-primary-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Outside click closes dropdown */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
