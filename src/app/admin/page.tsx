"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Boxes,
  RotateCcw,
  ArrowUpRight,
  Sparkles,
  Award
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminStats } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.admin.getStats()
      .then(setStats)
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-stone-500 font-mono">
        Loading administrative analytics...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-stone-200 text-center text-xs text-stone-600">
        Failed to fetch stats. Ensure the backend server is running.
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.total_revenue),
      sub: "Excluding cancelled orders",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Total Orders",
      value: stats.total_orders.toString(),
      sub: `${stats.pending_orders_count} pending dispatch`,
      icon: Package,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Total Customers",
      value: stats.total_customers.toString(),
      sub: "Registered shopper accounts",
      icon: Users,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      label: "Products in Catalog",
      value: stats.total_products.toString(),
      sub: "Active styles & silhouettes",
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
            Platform Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            + Add New Dress
          </Link>
          <Link
            href="/admin/orders"
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-stone-900 font-sans">{card.value}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Sales Bar Chart Simulation (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Daily Sales Trend (Last 7 Days)
            </h3>
            <span className="text-xs font-mono text-stone-400">Revenue (₹)</span>
          </div>

          {stats.daily_sales.length === 0 ? (
            <p className="text-xs text-stone-400 py-12 text-center">No sales records in this period.</p>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-end justify-between h-48 gap-3 pt-4 px-2">
                {stats.daily_sales.map((day) => {
                  const maxRev = Math.max(...stats.daily_sales.map((d) => d.revenue), 1000);
                  const heightPercent = Math.min(100, Math.max(15, (day.revenue / maxRev) * 100));

                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatPrice(day.revenue)}
                      </span>
                      <div
                        className="w-full max-w-[36px] bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-xl group-hover:brightness-110 transition-all shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-medium text-stone-500">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top Selling Products (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Top Selling Dresses
            </h3>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          {stats.top_selling_products.length === 0 ? (
            <p className="text-xs text-stone-400 py-12 text-center">No orders processed yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.top_selling_products.map((p, idx) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-stone-900 truncate">{p.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-stone-900 block">{p.sold} units</span>
                    <span className="text-[10px] text-emerald-700 font-medium">{formatPrice(p.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-base font-bold text-stone-900">
            Recent Orders
          </h3>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-600 hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {stats.recent_orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-stone-900">#{ord.order_number}</td>
                  <td className="py-3.5 font-medium text-stone-800">{ord.shipping_name}</td>
                  <td className="py-3.5 text-stone-500">{formatDate(ord.created_at)}</td>
                  <td className="py-3.5 font-bold text-stone-900">{formatPrice(ord.total_amount)}</td>
                  <td className="py-3.5">
                    <span className="text-stone-700 font-medium">{ord.payment_method}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.order_status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : ord.order_status === "Cancelled"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {ord.order_status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
