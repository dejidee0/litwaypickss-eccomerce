import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { CreditCard, Smartphone } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useLoyalty } from "../lib/loyalty-context";
import { formatCurrency } from "../lib/currency";
import { toast } from "sonner";
import LoyaltyDiscountBanner from "../components/Loyalty/LoyaltyDiscountBanner";

export default function CheckoutPage() {
  const navigate = useNavigate();
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
  // At the point of sending to backend:

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const rawPhone = formData.phone.replace(/\D/g, ""); // removes + and dashes
    const formattedPhone = rawPhone.startsWith("231")
      ? rawPhone
      : `231${rawPhone.replace(/^0+/, "")}`;
    console.log("Sending MoMo payment to:", formattedPhone);

    if (formData.paymentMethod === "momo") {
      try {
        const momoResponse = await fetch("http://localhost:5000/api/momo/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formattedPhone,
            amount: finalTotal,
            externalId: `ORDER-${Date.now()}`,
            payerMessage: "Checkout Payment",
          }),
        });

        const data = await momoResponse.json();

        if (!data.success) throw new Error("Payment failed");

        // Add loyalty points
        const isFirstPurchase = false;
        addPointsForPurchase(finalTotal, isFirstPurchase);

        toast.success(
          "Payment successful! You’ll receive confirmation shortly."
        );
        setLoading(false);
        navigate("/confirmation", {
          state: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            amount: finalTotal,
          },
        });
        // 🚀 Redirect here

        // ❌ No need for clearCart() here anymore
      } catch (error) {
        console.error(error);
        toast.error(
          "MoMo Payment Failed. Please check your number and try again."
        );
        setLoading(false);
      }
    } else {
      toast.info("Other payment methods coming soon.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h1>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <LoyaltyDiscountBanner
            orderTotal={total}
            onDiscountApplied={handleDiscountApplied}
            appliedDiscount={appliedDiscount}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="First Name"
                  className="input"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Last Name"
                  className="input"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email"
                  className="input"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+231-XXX-XXX-XXX"
                  className="input"
                />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Street address"
                className="input mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City"
                  className="input"
                />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
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

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={formData.paymentMethod === "momo"}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <Smartphone className="h-5 w-5 text-primary-600 mr-3" />
                <span>Mobile Money (MoMo)</span>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-not-allowed opacity-50">
                <input type="radio" disabled className="mr-3" />
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-400">Card (Coming Soon)</span>
              </label>
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

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex space-x-3 mb-4">
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-sm">Qty: {item.quantity}</p>
                  <p className="font-bold">
                    {formatCurrency(
                      (item.salePrice || item.price) * item.quantity
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Discount</span>
                  <span>-{formatCurrency(appliedDiscount.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-purple-50 border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-1">
              🎉 Loyalty Points
            </h3>
            <p className="text-purple-700 text-sm">
              You'll earn <strong>{pointsToEarn}</strong> points on this order!
            </p>
          </div>

          <div className="card p-6 bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2">
              🚚 Free Delivery
            </h3>
            <p className="text-green-700 text-sm">
              Nationwide delivery in 1-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
