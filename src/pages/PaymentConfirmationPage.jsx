// src/pages/PaymentConfirmationPage.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../lib/cart-context";

export default function PaymentConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const order = location.state;

  useEffect(() => {
    clearCart();
    const timer = setTimeout(() => {
      navigate("/shop");
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate, clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        ✅ Payment Successful!
      </h1>
      {order ? (
        <div className="max-w-md mx-auto mt-4 bg-white shadow p-6 rounded-lg text-left">
          <h2 className="text-lg font-semibold mb-2">Receipt</h2>
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Amount Paid:</strong> ${order.amount.toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">Order details not found.</p>
      )}

      <p className="mt-8 text-sm text-gray-500">
        Redirecting you back to the shop...
      </p>
      <button
        onClick={() => navigate("/shop")}
        className="btn btn-primary mt-4"
      >
        Go to Products Now
      </button>
    </div>
  );
}
