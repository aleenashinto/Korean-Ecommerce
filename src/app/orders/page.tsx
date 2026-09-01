"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, ArrowRight, Clock, CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function OrdersListPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getMyOrders()
        .then((data) => setOrders(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Please Sign In</h2>
        <p className="text-xs text-stone-500">Sign in to track and view your order history.</p>
        <Link href="/login?redirect=/orders" className="inline-block bg-brand-600 text-white text-xs font-semibold px-8 py-3 rounded-full">
          Sign In
        </Link>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Shipped":
      case "Out for Delivery":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Processing":
      case "Confirmed":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">History & Status</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            My Orders
          </h1>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
          Browse Shop &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">No orders placed yet</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            When you place an order, your items and live tracking pipeline will appear right here.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-8 py-3 rounded-full"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-stone-900">
                    #{order.order_number}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadgeClass(order.order_status)}`}>
                    Status: {order.order_status}
                  </span>
                  <span className="text-sm font-extrabold text-stone-950 font-sans">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img
                      src={it.image_url || "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80"}
                      alt={it.product_name}
                      className="w-14 h-16 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold text-stone-900 truncate">{it.product_name}</p>
                      <p className="text-stone-500 text-[11px]">{it.color} • Size {it.size}</p>
                      <p className="text-stone-700 font-mono font-bold">{formatPrice(it.price)} × {it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-600" />
                  {order.estimated_delivery}
                </span>

                <Link
                  href={`/orders/${order.order_number}`}
                  className="bg-stone-900 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Track & View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
