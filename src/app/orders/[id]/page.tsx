"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowLeft,
  ShieldCheck,
  Building,
  CreditCard,
  X,
  FileText
} from "lucide-react";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function OrderDetailPage() {
  const params = useParams();
  const orderIdOrNumber = params.id as string;
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Return modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Wrong size");
  const [returnDetails, setReturnDetails] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  useEffect(() => {
    if (user && orderIdOrNumber) {
      api.getOrderDetail(orderIdOrNumber)
        .then(setOrder)
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [user, orderIdOrNumber]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-8 text-center text-xs text-stone-500">
        Loading order details and tracking timeline...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">We couldn't retrieve this order reference.</p>
        <Link href="/orders" className="inline-block bg-brand-600 text-white text-xs font-semibold px-6 py-2.5 rounded-full">
          Back to Orders
        </Link>
      </div>
    );
  }

  const pipelineStages = [
    { key: "Pending", label: "Order Placed" },
    { key: "Confirmed", label: "Confirmed" },
    { key: "Processing", label: "Processing" },
    { key: "Shipped", label: "Shipped" },
    { key: "Out for Delivery", label: "Out for Delivery" },
    { key: "Delivered", label: "Delivered" },
  ];

  const currentStageIndex = pipelineStages.findIndex((s) => s.key === order.order_status);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReturn(true);
    try {
      await api.submitReturn({
        order_id: order.id,
        reason: returnReason,
        details: returnDetails.trim() || undefined,
      });
      alert("✅ Return request submitted successfully! Our support team will review and contact you within 24 hours.");
      setIsReturnModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to submit return request.");
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Back button & Header */}
      <div>
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Order Reference</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
              Order #{order.order_number}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {order.order_status === "Delivered" && (
              <button
                onClick={() => setIsReturnModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TRACKING TIMELINE PIPELINE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-600" />
            <h3 className="font-serif text-base font-bold text-stone-900">Live Delivery Tracking</h3>
          </div>
          <span className="text-xs font-mono text-stone-500">AWB: {order.tracking_number}</span>
        </div>

        {/* Pipeline Steps Bar */}
        <div className="relative py-4">
          <div className="grid grid-cols-6 gap-2 text-center relative z-10">
            {pipelineStages.map((stage, idx) => {
              const isCompleted = currentStageIndex !== -1 && idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      isCompleted
                        ? "bg-brand-600 text-white shadow-brand-200"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    } ${isCurrent ? "ring-4 ring-brand-100 scale-110" : ""}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 ${isCompleted ? "text-stone-900" : "text-stone-400"}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-600 font-medium">Estimated Arrival: <strong>{order.estimated_delivery}</strong></span>
          <span className="text-brand-600 font-semibold">Courier: Express Haute Dispatch</span>
        </div>
      </div>

      {/* ORDER ITEMS & BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Items List (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
            Ordered Items ({order.items.length})
          </h3>
          <div className="space-y-4">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-4 text-xs pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                <img
                  src={it.image_url || "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80"}
                  alt={it.product_name}
                  className="w-16 h-20 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="font-semibold text-stone-900 truncate">{it.product_name}</h4>
                  <p className="text-stone-500 text-[11px]">{it.color} • Size {it.size}</p>
                  <p className="text-stone-600 font-mono">{formatPrice(it.price)} × {it.quantity}</p>
                </div>
                <div className="font-bold text-stone-950 font-sans">{formatPrice(it.total_price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment Info (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Shipping Address Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2 text-xs">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] text-brand-600">
              Shipping Destination
            </h4>
            <p className="font-bold text-stone-900">{order.shipping_name}</p>
            <p className="text-stone-600 leading-relaxed">{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}</p>
            <p className="text-stone-500">Phone: {order.shipping_phone}</p>
          </div>

          {/* Payment & Invoice Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-3 text-xs">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] text-brand-600">
              Payment Summary
            </h4>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Method:</span>
                <strong className="text-stone-900">{order.payment_method}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <strong className="text-emerald-700 font-semibold">{order.payment_status}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-100">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>- {formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{order.delivery_fee === 0 ? "FREE" : formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>{formatPrice(order.tax_amount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm text-stone-950">
                <span>Total Paid:</span>
                <span className="text-brand-600">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Request Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Request Return / Exchange</h3>
              <button onClick={() => setIsReturnModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Reason for Return *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Wrong size">Wrong size / fit issue</option>
                  <option value="Damaged product">Damaged or defective product</option>
                  <option value="Wrong product">Received wrong product / color</option>
                  <option value="Quality issue">Fabric quality didn't meet expectation</option>
                  <option value="Product doesn't match description">Doesn't match website photos</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={returnDetails}
                  onChange={(e) => setReturnDetails(e.target.value)}
                  placeholder="Please provide any additional comments or pickup notes..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500">
                Returns are accepted within 7 days of delivery. Our logistics partner will pick up the item from your shipping address.
              </div>

              <button
                type="submit"
                disabled={isSubmittingReturn}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-md"
              >
                {isSubmittingReturn ? "Submitting Request..." : "Submit Return Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
