"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  UploadCloud,
  Sparkles,
  X,
  ArrowRight,
  Eye,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose }) => {
  const [selectedInspiration, setSelectedInspiration] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const sampleInspirations = [
    {
      label: "Pastel Floral Vacation Look",
      tags: ["floral", "pink", "maxi", "summer"],
      img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "Emerald Velvet Cocktail Dress",
      tags: ["velvet", "emerald", "bodycon", "evening"],
      img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "Korean Minimalist Blazer Co-ord",
      tags: ["korean", "blazer", "satin", "western"],
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "Handcrafted Festive Organza Set",
      tags: ["organza", "anarkali", "gold", "indian"],
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleRunVisualSearch = async (tags: string[], imgUrl: string) => {
    setSelectedInspiration(imgUrl);
    setIsSearching(true);
    try {
      const res = await api.ai.visualSearch({
        image_url: imgUrl,
        image_tags: tags,
      });
      setResults(res.visual_matches || []);
    } catch (err) {
      console.error("Visual search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>AI Visual Image Search</span>
                <span className="text-[10px] bg-brand-100 text-brand-700 font-mono font-bold px-2 py-0.5 rounded-full">
                  CLIP Vision
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Upload or select an outfit inspiration photo to find matching silhouettes in our atelier.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Box or Preset Selection */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Choose an Inspiration Look or Drop an Image
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sampleInspirations.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleRunVisualSearch(item.tags, item.img)}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 text-left transition-all ${
                  selectedInspiration === item.img
                    ? "border-brand-600 ring-2 ring-brand-300 scale-102"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                    {item.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Matches Results */}
        {isSearching && (
          <div className="py-12 text-center space-y-2 text-xs text-stone-500">
            <Sparkles className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p>Analyzing color palettes, fabric textures, and silhouette vectors...</p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-stone-900">
                Visual Matches Found ({results.length})
              </h4>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High AI Confidence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((r, idx) => {
                const prod = r.product;
                return (
                  <div
                    key={idx}
                    className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 p-3 space-y-2 flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                      <img
                        src={prod.primary_image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-stone-900/90 text-champagne-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shadow-md backdrop-blur-sm">
                        {r.visual_similarity_score}% Match
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h5 className="font-semibold text-xs text-stone-900 truncate">{prod.name}</h5>
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-stone-900 font-sans text-xs">{formatPrice(prod.selling_price)}</span>
                        <span className="text-[10px] text-stone-400">{prod.available_sizes.slice(0, 3).join(", ")}</span>
                      </div>
                    </div>

                    <Link
                      href={`/product/${prod.slug || prod.id}`}
                      onClick={onClose}
                      className="w-full bg-stone-900 hover:bg-brand-600 text-white text-[11px] font-bold py-2 rounded-xl text-center block transition-colors mt-1"
                    >
                      View Silhouette
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
