"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, X, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(999);
  const [maxDiscount, setMaxDiscount] = useState<number>(500);
  const [usageLimit, setUsageLimit] = useState<number>(1000);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon({
        code: code.trim().toUpperCase(),
        description,
        discount_type: discountType,
        discount_value: discountValue,
        min_order_amount: minOrder,
        max_discount_amount: maxDiscount || undefined,
        usage_limit: usageLimit,
        is_active: true,
      });
      alert("🎉 Coupon created successfully!");
      setIsModalOpen(false);
      setCode("");
      setDescription("");
      loadCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.admin.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
            Promotions & Discounts
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            Coupon Management ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading coupons...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <th className="pb-3 font-semibold">Coupon Code</th>
                  <th className="pb-3 font-semibold">Discount</th>
                  <th className="pb-3 font-semibold">Min Order</th>
                  <th className="pb-3 font-semibold">Usage Limit / Used</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-brand-700 bg-brand-50/60 px-2 rounded-lg">
                      {c.code}
                    </td>
                    <td className="py-3.5 font-bold text-stone-900">
                      {c.discount_type === "percent" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                    </td>
                    <td className="py-3.5 font-mono text-stone-600">₹{c.min_order_amount}</td>
                    <td className="py-3.5 font-mono text-stone-600">
                      {c.usage_count} / {c.usage_limit}
                    </td>
                    <td className="py-3.5 text-stone-500 max-w-xs truncate">{c.description}</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Create New Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 25% discount for Diwali season orders"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
              >
                Save & Activate Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
