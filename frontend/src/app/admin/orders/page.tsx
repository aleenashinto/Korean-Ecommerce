"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  XCircle,
  Filter,
  ExternalLink,
  ShieldAlert,
  ShieldCheck as ShieldCheckIcon,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeFraudRisk, setActiveFraudRisk] = useState<any | null>(null);
  const [loadingFraudId, setLoadingFraudId] = useState<number | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getOrders({
        status: statusFilter,
        q: searchQuery || undefined,
      });
      setOrders(data.items || []);
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.admin.updateOrderStatus(orderId, {
        order_status: newStatus,
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingUpdate = async (orderId: number) => {
    const tracking = prompt("Enter new Courier Tracking / AWB Number:");
    if (!tracking) return;
    try {
      const updated = await api.admin.updateOrderStatus(orderId, {
        order_status: "Shipped",
        tracking_number: tracking.trim(),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert(err.message || "Failed to update tracking");
    }
  };

  const handleCheckFraudRisk = async (orderId: number) => {
    setLoadingFraudId(orderId);
    try {
      const riskData = await api.ai.getFraudRisk(orderId);
      setActiveFraudRisk(riskData);
    } catch (err: any) {
      alert(err.message || "Failed to evaluate order risk");
    } finally {
      setLoadingFraudId(null);
    }
  };

  const statuses = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
          Fulfillment & Dispatch
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
          Order Management ({orders.length})
        </h1>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. ALX10025) or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-xs text-stone-800 focus:outline-none placeholder-stone-400"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No orders found for this status.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer & Address</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Order Status</th>
                  <th className="pb-3 font-semibold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 align-top">
                      <span className="font-mono font-bold text-stone-900 block">#{ord.order_number}</span>
                      <span className="text-[10px] text-stone-400 block">{formatDate(ord.created_at)}</span>
                      {ord.tracking_number && (
                        <span className="text-[10px] text-brand-700 font-mono block mt-1">
                          AWB: {ord.tracking_number}
                        </span>
                      )}
                      <button
                        onClick={() => handleCheckFraudRisk(ord.id)}
                        disabled={loadingFraudId === ord.id}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-1.5 py-0.5 rounded mt-1.5"
                        title="AI Fraud & Risk Scoring"
                      >
                        <ShieldAlert className="w-3 h-3 text-brand-600" />
                        <span>{loadingFraudId === ord.id ? "Analyzing..." : "AI Risk Check"}</span>
                      </button>
                    </td>

                    <td className="py-4 align-top max-w-xs">
                      <span className="font-bold text-stone-900 block">{ord.shipping_name}</span>
                      <span className="text-stone-500 text-[11px] block">{ord.shipping_phone}</span>
                      <span className="text-stone-500 text-[11px] block truncate">{ord.shipping_address}, {ord.shipping_city}</span>
                    </td>

                    <td className="py-4 align-top">
                      <div className="space-y-1">
                        {ord.items.map((it) => (
                          <div key={it.id} className="text-[11px] text-stone-700 flex items-center gap-1.5">
                            <span className="font-semibold">{it.product_name}</span>
                            <span className="text-stone-400">({it.size} × {it.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 align-top font-bold text-stone-950 font-sans">
                      {formatPrice(ord.total_amount)}
                    </td>

                    <td className="py-4 align-top">
                      <span className="block font-medium text-stone-800">{ord.payment_method}</span>
                      <span className={`text-[10px] font-bold ${
                        ord.payment_status === "Paid" ? "text-emerald-700" : "text-amber-700"
                      }`}>
                        {ord.payment_status}
                      </span>
                    </td>

                    <td className="py-4 align-top">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.order_status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.order_status === "Cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {ord.order_status}
                      </span>
                    </td>

                    <td className="py-4 align-top text-right space-y-1">
                      <select
                        value={ord.order_status}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 cursor-pointer focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleTrackingUpdate(ord.id)}
                        className="block w-full text-right text-[10px] font-semibold text-brand-600 hover:underline"
                      >
                        Edit Tracking #
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Fraud Risk Analysis Modal */}
      {activeFraudRisk && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-600" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  AI Order Risk Report #{activeFraudRisk.order_number}
                </h3>
              </div>
              <button onClick={() => setActiveFraudRisk(null)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Calculated Fraud Risk Level:</span>
              <span className={`px-3 py-1 rounded-full font-bold font-mono text-[11px] ${
                activeFraudRisk.risk_level === "LOW"
                  ? "bg-emerald-100 text-emerald-800"
                  : activeFraudRisk.risk_level === "MEDIUM"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}>
                {activeFraudRisk.risk_level} RISK ({activeFraudRisk.risk_score}/100)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-900 block">Identified Risk Factors:</span>
              <ul className="space-y-1 text-stone-600 list-disc list-inside">
                {activeFraudRisk.risk_factors.map((f: string, idx: number) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <strong className="block">AI Recommendation:</strong>
              <p className="text-[11px] leading-relaxed">{activeFraudRisk.recommendation}</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveFraudRisk(null)}
              className="w-full bg-stone-900 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition-colors text-xs"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
