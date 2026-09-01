"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  ArrowRight,
  Plus,
  ShoppingBag,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { Address, Order } from "@/types";
import { formatPrice } from "@/lib/utils";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponFromUrl = searchParams.get("coupon") || "";

  const { user } = useAuth();
  const { cart, refreshCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Address form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [upiId, setUpiId] = useState("sharma.ananya@oksbi");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8890");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("321");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(`${user.first_name} ${user.last_name}`.trim());
      if (user.phone) setPhone(user.phone);

      api.getAddresses().then((addrs) => {
        setAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedAddressId(addrs[0].id);
          setFullName(addrs[0].full_name);
          setPhone(addrs[0].phone);
          setStreetAddress(addrs[0].street_address);
          setCity(addrs[0].city);
          setState(addrs[0].state);
          setPostalCode(addrs[0].postal_code);
        } else {
          setSelectedAddressId("new");
          setIsAddingNewAddress(true);
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Please Sign In</h2>
        <p className="text-xs text-stone-500">You must be signed in to complete your checkout.</p>
        <Link href="/login?redirect=/checkout" className="inline-block bg-brand-600 text-white text-xs font-semibold px-8 py-3 rounded-full">
          Sign In Now
        </Link>
      </div>
    );
  }

  // If Order Placed: Step 4 Confirmation Screen
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-600">
              Payment & Order Verified
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-stone-900">
              🎉 Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Thank you, {placedOrder.shipping_name}. We have received your order and our atelier has begun preparing your pieces.
            </p>
          </div>

          {/* Order Summary Box */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 text-left space-y-3 font-sans text-xs">
            <div className="flex justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Order Number:</span>
              <strong className="font-mono text-stone-900 text-sm">{placedOrder.order_number}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Estimated Delivery:</span>
              <strong className="text-stone-900">{placedOrder.estimated_delivery}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Mode:</span>
              <span className="text-stone-900 font-semibold">{placedOrder.payment_method} ({placedOrder.payment_status})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Tracking Reference:</span>
              <span className="font-mono text-brand-700 font-semibold">{placedOrder.tracking_number}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-950">
              <span>Total Amount:</span>
              <span className="text-brand-600">{formatPrice(placedOrder.total_amount)}</span>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/orders/${placedOrder.order_number}`}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors shadow-lg"
            >
              View Order Details & Tracking
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !streetAddress || !city || !state || !postalCode) {
      alert("Please fill in all shipping address fields.");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Save address if new
      if (selectedAddressId === "new") {
        await api.createAddress({
          full_name: fullName,
          phone,
          street_address: streetAddress,
          city,
          state,
          postal_code: postalCode,
          is_default: true,
        });
      }

      const orderResult = await api.createOrder({
        shipping_name: fullName,
        shipping_phone: phone,
        shipping_address: streetAddress,
        shipping_city: city,
        shipping_state: state,
        shipping_postal_code: postalCode,
        payment_method: paymentMethod,
        coupon_code: couponFromUrl || undefined,
      });

      setPlacedOrder(orderResult);
      await refreshCart();
    } catch (err: any) {
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200">
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Checkout Process</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
          Secure Order Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form: Step 1 (Address) & Step 3 (Payment) - 7 Cols */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: SHIPPING ADDRESS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">Shipping Address</h3>
              </div>
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAddressId("new");
                    setIsAddingNewAddress(true);
                    setStreetAddress("");
                    setCity("");
                    setState("");
                    setPostalCode("");
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Address
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {addresses.length > 0 && !isAddingNewAddress && (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-brand-600 bg-brand-50/40"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selected_address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => {
                            setSelectedAddressId(addr.id);
                            setFullName(addr.full_name);
                            setPhone(addr.phone);
                            setStreetAddress(addr.street_address);
                            setCity(addr.city);
                            setState(addr.state);
                            setPostalCode(addr.postal_code);
                          }}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="font-semibold text-xs text-stone-900">{addr.full_name}</span>
                      </div>
                      <span className="text-[11px] text-stone-500">{addr.phone}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 pl-5">
                      {addr.street_address}, {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                  </label>
                ))}
              </div>
            )}

            {/* New / Edit Address Input Fields */}
            {(isAddingNewAddress || addresses.length === 0) && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98123 45678"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address / House / Flat *</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Royale Palms Apartment, 100ft Road, Indiranagar"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="560038"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="text-xs text-stone-500 hover:text-stone-800 underline"
                  >
                    Cancel and choose from saved addresses
                  </button>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Payment Option</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "UPI", label: "Instant UPI", icon: QrCode, desc: "GPay / PhonePe / QR" },
                { id: "Card", label: "Debit / Credit", icon: CreditCard, desc: "Visa, Mastercard" },
                { id: "Net Banking", label: "Net Banking", icon: Building, desc: "All Major Banks" },
                { id: "Cash on Delivery", label: "Pay on Delivery", icon: Banknote, desc: "Cash or QR at door" },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                      active
                        ? "border-brand-600 bg-brand-50/50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-brand-600" : "text-stone-500"}`} />
                    <div className="mt-3">
                      <span className="block text-xs font-bold text-stone-900">{opt.label}</span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment simulation sub-boxes */}
            {paymentMethod === "UPI" && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-semibold text-stone-700">Enter Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  placeholder="yourname@okhdfcbank"
                />
                <p className="text-[11px] text-stone-400">A payment prompt will be simulated instantly upon placing order.</p>
              </div>
            )}

            {paymentMethod === "Card" && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Step 2 (Order Items & Total) - 5 Cols */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-stone-900">Order Summary</h3>
            <span className="text-xs font-mono text-stone-500">{items.length} Item(s)</span>
          </div>

          {/* Items mini list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-3 text-xs">
                <img
                  src={it.image_url || "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80"}
                  alt={it.product_name}
                  className="w-12 h-14 rounded-lg object-cover border border-stone-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 truncate">{it.product_name}</p>
                  <p className="text-stone-400 text-[11px]">{it.color_name} • {it.size} • Qty: {it.quantity}</p>
                </div>
                <div className="font-bold text-stone-900 font-sans">{formatPrice(it.total_price)}</div>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-extrabold text-stone-950">
              <span>Total Payable</span>
              <span className="text-brand-600 font-sans">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Submit Place Order Button */}
          <button
            type="submit"
            disabled={isPlacingOrder || items.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-stone-300 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 transition-all"
          >
            <span>{isPlacingOrder ? "Confirming Order..." : `Place Order • ${formatPrice(total)}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-[10px] text-stone-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Payment Simulation</span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-stone-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
