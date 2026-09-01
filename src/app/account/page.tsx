"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  RotateCcw,
  Tag,
  LogOut,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Address, Order, ReturnRequest, Coupon } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "dashboard";

  const { user, isAdmin, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Profile Edit Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address Add Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhone(user.phone || "");

      api.getMyOrders().then(setOrders).catch(() => {});
      api.getMyReturns().then(setReturns).catch(() => {});
      api.getCoupons().then(setCoupons).catch(() => {});
      api.getAddresses().then(setAddresses).catch(() => {});
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Sign in Required</h2>
        <p className="text-xs text-stone-500">Please sign in to access your customer dashboard.</p>
        <Link href="/login?redirect=/account" className="inline-block bg-brand-600 text-white text-xs font-semibold px-8 py-3 rounded-full">
          Sign In
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await api.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      await refreshUser();
      alert("✅ Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createAddress({
        full_name: newFullName,
        phone: newPhone,
        street_address: newStreet,
        city: newCity,
        state: newState,
        postal_code: newPin,
        is_default: addresses.length === 0,
      });
      setAddresses((prev) => [created, ...prev]);
      setIsAddingAddress(false);
      setNewFullName("");
      setNewPhone("");
      setNewStreet("");
      setNewCity("");
      setNewState("");
      setNewPin("");
    } catch (err: any) {
      alert(err.message || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete address");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: UserIcon },
    { id: "profile", label: "Profile Settings", icon: UserIcon },
    { id: "orders", label: "My Orders", icon: Package, count: orders.length },
    { id: "returns", label: "Returns & Exchanges", icon: RotateCcw, count: returns.length },
    { id: "addresses", label: "Saved Addresses", icon: MapPin, count: addresses.length },
    { id: "coupons", label: "My Coupons", icon: Tag, count: coupons.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-stone-100">
            <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-serif text-xl font-bold">
              {user.first_name[0]}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-stone-900 truncate">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-xs text-stone-500 truncate">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Store Administrator
                </span>
              )}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors mb-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Management Portal 👑</span>
              </Link>
            )}

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-brand-600" : "text-stone-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Right Content Area (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm min-h-[500px]">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Welcome Back</span>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  Hello, {user.first_name}!
                </h2>
                <p className="text-xs text-stone-500">Here is a quick snapshot of your Haute wardrobe activity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-1">
                  <span className="text-xs text-brand-700 font-semibold">Total Orders</span>
                  <p className="text-2xl font-extrabold text-brand-900 font-mono">{orders.length}</p>
                </div>
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-xs text-amber-700 font-semibold">Active Returns</span>
                  <p className="text-2xl font-extrabold text-amber-900 font-mono">
                    {returns.filter((r) => r.status === "Pending").length}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                  <span className="text-xs text-emerald-700 font-semibold">Available Coupons</span>
                  <p className="text-2xl font-extrabold text-emerald-900 font-mono">{coupons.length}</p>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-stone-900">Recent Order Activity</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-brand-600 font-semibold hover:underline">
                    View All &rarr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((ord) => (
                      <div key={ord.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-stone-900">#{ord.order_number}</span>
                          <p className="text-stone-500 text-[11px] mt-0.5">{formatDate(ord.created_at)} • {ord.items.length} Item(s)</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-900 font-sans block">{formatPrice(ord.total_amount)}</span>
                          <span className="text-[10px] text-brand-600 font-semibold">{ord.order_status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-stone-900">Personal Information</h2>
                <p className="text-xs text-stone-500">Update your account name and phone number.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">Email address cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-stone-900">Order History</h2>
                <p className="text-xs text-stone-500">Track current shipments and view previous receipts.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-500">No orders placed yet.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/60">
                        <span className="font-mono font-bold text-stone-900">#{ord.order_number}</span>
                        <span className="text-brand-600 font-semibold">{ord.order_status}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">{formatDate(ord.created_at)} • {ord.items.length} Product(s)</span>
                        <span className="font-extrabold text-stone-950 font-sans">{formatPrice(ord.total_amount)}</span>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/orders/${ord.order_number}`}
                          className="bg-stone-900 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                        >
                          View Details & Tracking
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RETURNS */}
          {activeTab === "returns" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-stone-900">Return Requests</h2>
                <p className="text-xs text-stone-500">Monitor status of your product returns and refunds.</p>
              </div>

              {returns.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-500">No active return requests.</div>
              ) : (
                <div className="space-y-3">
                  {returns.map((ret) => (
                    <div key={ret.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">Order #{ret.order_number || ret.order_id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ret.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : ret.status === "Rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {ret.status}
                        </span>
                      </div>
                      <p className="text-stone-600"><span className="text-stone-400">Reason:</span> {ret.reason}</p>
                      {ret.details && <p className="text-stone-500 text-[11px] italic">"{ret.details}"</p>}
                      {ret.admin_notes && (
                        <p className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 text-[11px]">
                          <strong>Admin Note:</strong> {ret.admin_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900">Saved Addresses</h2>
                  <p className="text-xs text-stone-500">Manage your shipping and billing destinations.</p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleCreateAddress} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 max-w-lg">
                  <h4 className="font-bold text-xs text-stone-900">New Address</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address / Apartment / Landmark"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="PIN Code"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Save Address</button>
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="text-xs text-stone-500 px-3 py-2">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 relative space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{a.full_name}</span>
                      <button onClick={() => handleDeleteAddress(a.id)} className="text-stone-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{a.street_address}, {a.city}, {a.state} - {a.postal_code}</p>
                    <p className="text-stone-500 text-[11px]">Phone: {a.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-stone-900">Available Coupons & Offers</h2>
                <p className="text-xs text-stone-500">Apply these promo codes during bag checkout to save.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-5 bg-gradient-to-r from-brand-50/50 via-white to-brand-50/20 rounded-2xl border border-brand-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-brand-700 bg-brand-100/60 px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <span className="font-bold text-stone-900 text-xs">
                        {c.discount_type === "percent" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{c.description}</p>
                    <p className="text-[10px] text-stone-400">Min. cart amount: ₹{c.min_order_amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-stone-500">Loading account...</div>}>
      <AccountDashboardContent />
    </Suspense>
  );
}
