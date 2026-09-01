"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, UserX, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  order_count: number;
  total_spend: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    try {
      const res = await api.admin.toggleCustomerStatus(userId);
      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, is_active: res.is_active } : c))
      );
    } catch (err: any) {
      alert(err.message || "Failed to toggle status");
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
          Shopper Directory
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
          Customer Management ({customers.length})
        </h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search customer by name, email, or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs text-stone-800 focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading customer accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Orders</th>
                  <th className="pb-3 font-semibold">Lifetime Spend</th>
                  <th className="pb-3 font-semibold">Member Since</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 font-bold text-stone-900">{c.name}</td>
                    <td className="py-3.5 text-stone-600">{c.email}</td>
                    <td className="py-3.5 text-stone-500 font-mono">{c.phone}</td>
                    <td className="py-3.5 font-bold text-stone-900 font-mono">{c.order_count}</td>
                    <td className="py-3.5 font-bold text-brand-700 font-sans">{formatPrice(c.total_spend)}</td>
                    <td className="py-3.5 text-stone-400">{formatDate(c.created_at)}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {c.is_active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className={`text-xs font-semibold underline ${
                          c.is_active ? "text-rose-600 hover:text-rose-700" : "text-emerald-700 hover:text-emerald-800"
                        }`}
                      >
                        {c.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
