import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { formatCurrency } from "../../lib/currency";
import { useCart } from "../../lib/cart-context";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase"; // Make sure this is configured

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [images, setImages] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { addItem } = useCart();

  // Fetch product images and category name
  useEffect(() => {
    async function fetchAdditionalData() {
      try {
        // Fetch images
        const { data: imagesData } = await supabase
          .from("product_images")
          .select("url")
          .eq("product_id", product.id)
          .order("created_at", { ascending: true });

        if (imagesData) setImages(imagesData.map((img) => img.url));

        // Fetch category name
        if (product.category_slug) {
          const { data: categoryData } = await supabase
            .from("categories")
            .select("name")
            .eq("slug", product.category_slug)
            .single();

          if (categoryData) setCategoryName(categoryData.name);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    fetchAdditionalData();
  }, [product.id, product.category_slug]);

  const primaryImage =
    images[0] ||
    "https://images.pexels.com/photos/5632396/pexels-photo-5632396.jpeg";
  const hoverImage = images[1] || primaryImage;

  const discountPercentage = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.stock || product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    // Prepare product data for cart
    const cartProduct = {
      ...product,
      images, // Include fetched images
      category: categoryName, // Include fetched category name
    };

    addItem(cartProduct);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Quick view coming soon!");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Added to wishlist!");
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden card-elevated border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-25 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}

          {/* Stock Badge */}
          {(!product.stock || product.stock === 0) && (
            <span className="absolute top-3 right-3 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Out of Stock
            </span>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ FEATURED
            </span>
          )}

          {/* Hover Actions */}
          <div
            className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex space-x-3">
              <button
                onClick={handleQuickView}
                className="rounded-full w-12 h-12 bg-white/95 hover:bg-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <Eye className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handleWishlist}
                className="rounded-full w-12 h-12 bg-white/95 hover:bg-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <Heart className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
                className="rounded-full w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-3">
          {/* Category */}
          <p className="text-xs text-primary-600 uppercase tracking-wide font-semibold">
            {categoryName || product.category_slug}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.review_count > 0 && product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                ({product.review_count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-900">
              {formatCurrency(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-1">
              <p className="text-xs text-orange-700 font-medium">
                ⚡ Only {product.stock} left in stock
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
