"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Trash2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getReviews();
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    try {
      await api.admin.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
          Community Trust
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
          Review Moderation ({reviews.length})
        </h1>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No reviews published yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <th className="pb-3 font-semibold">Dress Product</th>
                  <th className="pb-3 font-semibold">Author</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold">Review Feedback</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Verified</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 font-bold text-stone-900">{r.product_name || `Product #${r.product_id}`}</td>
                    <td className="py-3.5 font-medium text-stone-800">{r.user_name}</td>
                    <td className="py-3.5">
                      <div className="flex text-amber-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 max-w-sm">
                      {r.title && <strong className="block text-stone-900">{r.title}</strong>}
                      <span className="text-stone-600 line-clamp-2">{r.comment}</span>
                    </td>
                    <td className="py-3.5 text-stone-400">{formatDate(r.created_at)}</td>
                    <td className="py-3.5">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteReview(r.id)}
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
    </div>
  );
}
