"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Check, X, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { ReturnRequest } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReturn, setActiveReturn] = useState<ReturnRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [statusChoice, setStatusChoice] = useState<"Approved" | "Rejected" | "Refunded">("Approved");

  const loadReturns = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getReturns();
      setReturns(data);
    } catch (err) {
      console.error("Failed to load returns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleUpdateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReturn) return;
    try {
      await api.admin.updateReturnStatus(activeReturn.id, {
        status: statusChoice,
        admin_notes: adminNote.trim() || undefined,
      });
      alert(`🎉 Return #${activeReturn.id} updated to ${statusChoice}!`);
      setActiveReturn(null);
      setAdminNote("");
      loadReturns();
    } catch (err: any) {
      alert(err.message || "Failed to update return request");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
          After-Sales Care
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
          Return & Refund Management ({returns.length})
        </h1>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading returns...</div>
        ) : returns.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No return requests submitted.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <th className="pb-3 font-semibold">Return ID</th>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Reason</th>
                  <th className="pb-3 font-semibold">Requested On</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-stone-900">#RET-{r.id}</td>
                    <td className="py-3.5 font-mono text-brand-700 font-bold">#{r.order_number || r.order_id}</td>
                    <td className="py-3.5">
                      <span className="font-semibold text-stone-900 block">{r.customer_name}</span>
                      <span className="text-stone-400 text-[10px]">{r.customer_email}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-stone-800 block">{r.reason}</span>
                      {r.details && <span className="text-stone-500 text-[11px] block italic max-w-xs truncate">"{r.details}"</span>}
                    </td>
                    <td className="py-3.5 text-stone-500">{formatDate(r.created_at)}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "Refunded"
                          ? "bg-blue-100 text-blue-800"
                          : r.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          setActiveReturn(r);
                          setStatusChoice(r.status === "Pending" ? "Approved" : (r.status as any));
                          setAdminNote(r.admin_notes || "");
                        }}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PROCESS MODAL */}
      {activeReturn && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Process Return #{activeReturn.id}
              </h3>
              <button onClick={() => setActiveReturn(null)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <p><strong>Order:</strong> #{activeReturn.order_number}</p>
              <p><strong>Customer:</strong> {activeReturn.customer_name}</p>
              <p><strong>Reason:</strong> {activeReturn.reason}</p>
              {activeReturn.details && <p className="text-stone-600">"{activeReturn.details}"</p>}
            </div>

            <form onSubmit={handleUpdateReturn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Set Status Decision *</label>
                <select
                  value={statusChoice}
                  onChange={(e: any) => setStatusChoice(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Approved">Approve Pickup & Exchange</option>
                  <option value="Refunded">Approve & Issue Full Refund</option>
                  <option value="Rejected">Reject Return Request</option>
                  <option value="Pending">Keep Pending</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Admin Response / Pickup Instructions</label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Approved. Our courier will collect the package tomorrow afternoon."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
              >
                Save Decision & Update Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
