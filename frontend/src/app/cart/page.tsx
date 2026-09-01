"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, updateQuantity, removeItem, moveItemToWishlist, clearCart, isLoading } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Shopping Bag is Waiting</h2>
        <p className="text-xs text-stone-500">Sign in to view your items, saved sizes, and checkout smoothly.</p>
        <Link
          href="/login?redirect=/cart"
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-8 py-3 rounded-full shadow-md"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];
  const rawSubtotal = cart?.subtotal || 0;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await api.validateCoupon(couponCode.trim(), rawSubtotal);
      if (res.is_valid) {
        setCouponDiscount(res.discount_amount);
        setCouponMessage({ text: res.message, isError: false });
      } else {
        setCouponDiscount(0);
        setCouponMessage({ text: res.message, isError: true });
      }
    } catch (err: any) {
      setCouponMessage({ text: err.message || "Failed to validate coupon", isError: true });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const deliveryFee = rawSubtotal >= 999 || rawSubtotal === 0 ? 0 : 99;
  const taxAmount = Math.round(rawSubtotal * 0.05);
  const finalTotal = Math.max(0, rawSubtotal - couponDiscount + deliveryFee + taxAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Review & Order</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            My Shopping Bag ({items.reduce((s, it) => s + it.quantity, 0)} Items)
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => clearCart()}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            Clear Entire Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Your bag is empty</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Discover our new arrivals, trending floral maxis, and occasion couture to find your perfect fit.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-8 py-3 rounded-full transition-colors shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Thumbnail */}
                  <Link href={`/product/${item.product_slug || item.product_id}`} className="flex-shrink-0">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80"}
                      alt={item.product_name}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border border-stone-100"
                    />
                  </Link>

                  {/* Details */}
                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.product_slug || item.product_id}`}
                      className="text-sm font-semibold text-stone-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {item.product_name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>Color: <strong className="text-stone-700">{item.color_name}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-stone-700">{item.size}</strong></span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-stone-900 font-sans">
                        {formatPrice(item.price)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPrice(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper, Subtotal, and Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 px-2 py-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-sm font-extrabold text-stone-900 font-sans">
                    {formatPrice(item.total_price)}
                  </div>

                  {/* Move to Wishlist / Remove buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveItemToWishlist(item.id)}
                      title="Move to Wishlist"
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove Item"
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-md space-y-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-brand-600" /> Apply Coupon Code
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono uppercase focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="bg-stone-900 hover:bg-brand-600 disabled:bg-stone-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  {isValidatingCoupon ? "..." : "Apply"}
                </button>
              </form>

              {couponMessage && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-[11px] flex items-center gap-1.5 ${
                    couponMessage.isError
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {couponMessage.isError ? (
                    <XCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  )}
                  <span>{couponMessage.text}</span>
                </div>
              )}

              {/* Sample Coupons Suggestions */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setCouponCode("WELCOME10")}
                  className="bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-md font-mono hover:bg-brand-100"
                >
                  WELCOME10 (10% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => setCouponCode("SUMMER500")}
                  className="bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-md font-mono hover:bg-brand-100"
                >
                  SUMMER500 (₹500 OFF)
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-stone-900 font-sans">{formatPrice(rawSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- {formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-extrabold text-stone-950">
                <span>Total Amount</span>
                <span className="text-brand-600 font-sans">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                const query = couponDiscount > 0 ? `?coupon=${encodeURIComponent(couponCode)}` : "";
                router.push(`/checkout${query}`);
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-stone-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-600" /> Secure SSL</span>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-brand-600" /> Doorstep Pickup</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
