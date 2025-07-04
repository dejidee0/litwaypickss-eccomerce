import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Smartphone, Building } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useLoyalty } from "../lib/loyalty-context";
import { formatCurrency } from "../lib/currency";
import { toast } from "sonner";
import LoyaltyDiscountBanner from "../components/Loyalty/LoyaltyDiscountBanner";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { addPointsForPurchase } = useLoyalty();
  const [loading, setLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "momo",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDiscountApplied = (discount) => {
    setAppliedDiscount(discount);
  };

  const finalTotal = appliedDiscount ? total - appliedDiscount.discount : total;
  const pointsToEarn = Math.floor(finalTotal * 1); // 1 point per LRD

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order processing
    setTimeout(() => {
      // Add loyalty points for the purchase
      const isFirstPurchase = false; // You can track this in user data
      addPointsForPurchase(finalTotal, isFirstPurchase);

      toast.success(
        "Order placed successfully! You will receive a confirmation shortly."
      );
      clearCart();
      setLoading(false);
      // In a real app, redirect to order confirmation page
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Loyalty Discount Banner */}
          <LoyaltyDiscountBanner
            orderTotal={total}
            onDiscountApplied={handleDiscountApplied}
            appliedDiscount={appliedDiscount}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="+231-XXX-XXX-XXX"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      County *
                    </label>
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select County</option>
                      <option value="montserrado">Montserrado</option>
                      <option value="nimba">Nimba</option>
                      <option value="bong">Bong</option>
                      <option value="lofa">Lofa</option>
                      <option value="grand-bassa">Grand Bassa</option>
                      <option value="margibi">Margibi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={formData.paymentMethod === "momo"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Smartphone className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium">Mobile Money (MoMo)</div>
                    <div className="text-sm text-gray-600">
                      Pay with Orange Money, MTN MoMo
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Building className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">
                      Pay when you receive your order
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    disabled
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-400">
                      Credit/Debit Card
                    </div>
                    <div className="text-sm text-gray-400">Coming soon</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : `Place Order - ${formatCurrency(finalTotal)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.pexels.com/photos/5632396/pexels-photo-5632396.jpeg"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(
                        (item.salePrice || item.price) * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Discount (50%)</span>
                  <span>-{formatCurrency(appliedDiscount.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Loyalty Points Preview */}
          <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">
              🎉 Loyalty Points
            </h3>
            <p className="text-sm text-purple-700 mb-3">
              You'll earn{" "}
              <span className="font-bold">{pointsToEarn} points</span> from this
              purchase!
            </p>
            <div className="text-xs text-purple-600">
              Points are earned on the final order total after discounts
            </div>
          </div>

          <div className="card p-6 bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2">
              Free Delivery Included!
            </h3>
            <p className="text-sm text-green-700">
              Your order qualifies for free nationwide delivery. Estimated
              delivery: 1-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
