"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Check, Plus, Tag } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface CompleteTheLookProps {
  productId: number;
  currentVariantId?: number;
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({ productId, currentVariantId }) => {
  const [bundleData, setBundleData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      api.ai.getCompleteTheLook(productId)
        .then(setBundleData)
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [productId]);

  if (isLoading || !bundleData) return null;

  const handleAddBundle = async () => {
    if (!currentVariantId) {
      alert("Please choose a dress size first.");
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(productId, currentVariantId, 1);
      alert("✨ Added styled look to your shopping bag! (Dress + Accompanying stylist accessories)");
    } catch (err: any) {
      alert(err.message || "Please log in to add items to bag.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-stone-900 via-brand-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-brand-800/50 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-500/40 flex items-center justify-center text-champagne-300 border border-brand-400/50">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Complete The Look <span className="text-champagne-300 font-sans font-normal text-xs">(AI Stylist Pairing)</span>
            </h3>
            <p className="text-[11px] text-stone-300">Curated accessories, jewelry & footwear designed to match this silhouette</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-champagne-300 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider font-mono self-start sm:self-auto">
          Save 15% on Bundle
        </span>
      </div>

      {/* Accessories Items Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {bundleData.paired_accessories.map((acc: any) => (
          <div
            key={acc.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3"
          >
            <img
              src={acc.image_url}
              alt={acc.name}
              className="w-16 h-16 rounded-xl object-cover border border-white/15 flex-shrink-0"
            />
            <div className="min-w-0 space-y-0.5 text-xs">
              <span className="text-[10px] text-champagne-300 uppercase tracking-wider font-mono font-bold block">
                {acc.category}
              </span>
              <h4 className="font-semibold text-white truncate text-[11px]">{acc.name}</h4>
              <p className="text-stone-300 text-[10px] line-clamp-1 italic">"{acc.styling_tip}"</p>
              <span className="font-bold text-white font-sans text-xs block">{formatPrice(acc.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Pricing Bar & Add All Button */}
      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-baseline gap-3 text-xs">
          <span className="text-stone-300">Styled Ensemble Total:</span>
          <span className="text-2xl font-extrabold text-white font-sans">
            {formatPrice(bundleData.bundle_special_price)}
          </span>
          <span className="text-stone-400 line-through text-xs font-sans">
            {formatPrice(bundleData.bundle_original_price)}
          </span>
          <span className="text-emerald-400 font-bold font-mono text-[11px]">
            (Save {formatPrice(bundleData.bundle_savings)})
          </span>
        </div>

        <button
          onClick={handleAddBundle}
          disabled={isAdding}
          className="w-full sm:w-auto bg-champagne-300 hover:bg-champagne-400 text-stone-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isAdding ? "Adding Bundle..." : "Add Complete Look to Bag"}</span>
        </button>
      </div>
    </div>
  );
};
