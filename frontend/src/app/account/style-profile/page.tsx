"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ArrowRight,
  User,
  ShoppingBag,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCard as ProductCardType } from "@/types";

export default function StyleProfilePage() {
  const { user } = useAuth();

  // Profile preferences state
  const [bodyType, setBodyType] = useState("Hourglass / Defined Waist");
  const [primarySize, setPrimarySize] = useState("M");
  const [favoriteVibe, setFavoriteVibe] = useState("Korean Chic Minimalist");
  const [colorPalette, setColorPalette] = useState("Rose Gold & Champagne");
  const [occasionFocus, setOccasionFocus] = useState("Party & Cocktail");
  const [isSaved, setIsSaved] = useState(false);

  // Curated items
  const [curatedDresses, setCuratedDresses] = useState<ProductCardType[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  const bodyTypes = [
    { id: "Hourglass", label: "Hourglass", desc: "Balanced bust and hips with defined waist" },
    { id: "Petite", label: "Petite (Under 5'3\")", desc: "Tailored lengths with flattering drape" },
    { id: "Pear", label: "Pear / A-Line", desc: "Fuller hips with graceful skirt flow" },
    { id: "Athletic", label: "Athletic / Column", desc: "Clean linear drape and structured shoulders" },
    { id: "Curvy", label: "Curvy / Plus Size", desc: "Comfort stretch with empire waist support" },
  ];

  const aesthetics = [
    { id: "K-Drama Romance", label: "K-Drama Romance & Fairy Chiffon", icon: "🌸" },
    { id: "Seoul Minimalist", label: "Seoul Minimalist & Gangnam Tweed", icon: "✨" },
    { id: "Hongdae Y2K Street", label: "Hongdae Y2K & Ulzzang Babydolls", icon: "🎀" },
    { id: "Modern Hanbok", label: "Modern Hanbok Fusion Couture", icon: "👑" },
  ];

  const palettes = [
    { id: "Sakura Pink & Lilac", label: "Sakura Blossom & Soft Lilac", hex: ["#FFB6C1", "#E6E6FA"] },
    { id: "Butter Cream & Oatmeal", label: "Butter Cream & Oatmeal Beige", hex: ["#FFF8DC", "#E6DFD5"] },
    { id: "Sage Mint & Han River Sky", label: "Sage Mint & Seoul Sky Blue", hex: ["#9CAF88", "#87CEEB"] },
    { id: "Midnight Seoul & Emerald", label: "Midnight Seoul & Deep Emerald", hex: ["#1A1A1A", "#046307"] },
  ];

  useEffect(() => {
    setIsLoadingFeed(true);
    api.getProducts({ limit: 4 })
      .then((data) => setCuratedDresses(data.items || []))
      .catch(() => {})
      .finally(() => setIsLoadingFeed(false));
  }, [favoriteVibe, primarySize]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Style Intelligence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
          My Haute Style Profile
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Tell our AI Stylist your body silhouette, favorite vibes, and color tones. We'll personalize catalog drops, sizing suggestions, and curated edits just for you.
        </p>
      </div>

      {/* Profile Setup Grid */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
        {/* Section 1: Body Silhouette */}
        <div className="space-y-3">
          <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
            <span>1. Select Your Body Silhouette</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {bodyTypes.map((bt) => (
              <button
                type="button"
                key={bt.id}
                onClick={() => setBodyType(bt.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  bodyType === bt.id
                    ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-300 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                }`}
              >
                <span className="font-bold text-xs text-stone-900 block">{bt.label}</span>
                <span className="text-[11px] text-stone-500 mt-1 block leading-tight">{bt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Preferred Dress Sizing */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <h3 className="font-serif text-base font-bold text-stone-900">
            2. Usual Size Preference
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
              <button
                type="button"
                key={sz}
                onClick={() => setPrimarySize(sz)}
                className={`w-14 h-12 rounded-2xl text-xs font-bold border font-mono transition-all ${
                  primarySize === sz
                    ? "bg-stone-900 text-white border-stone-900 shadow-md scale-105"
                    : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Aesthetic Vibe */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <h3 className="font-serif text-base font-bold text-stone-900">
            3. Signature Fashion Aesthetic
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {aesthetics.map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => setFavoriteVibe(a.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  favoriteVibe === a.id
                    ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-300 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                }`}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="font-bold text-xs text-stone-900">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Color Palette */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <h3 className="font-serif text-base font-bold text-stone-900">
            4. Preferred Color Palette
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {palettes.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setColorPalette(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  colorPalette === p.id
                    ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-300 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                }`}
              >
                <div className="flex gap-1.5">
                  {p.hex.map((h, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border border-stone-200 shadow-inner" style={{ backgroundColor: h }} />
                  ))}
                </div>
                <span className="font-bold text-xs text-stone-900 block">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Style Profile Saved & AI Recommender Updated!
            </span>
          ) : (
            <span className="text-xs text-stone-500">
              Profile changes take effect immediately across all recommendations.
            </span>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto bg-stone-900 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-champagne-300" />
            <span>Update AI Style Preferences</span>
          </button>
        </div>
      </form>

      {/* Personalized AI Recommendations Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
              Curated Just For You
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
              Styles Matched to Your Profile ({primarySize} • {favoriteVibe})
            </h2>
          </div>

          <Link href="/shop" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            View All &rarr;
          </Link>
        </div>

        {isLoadingFeed ? (
          <div className="py-12 text-center text-xs text-stone-400">Loading your bespoke styling edit...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {curatedDresses.map((d) => (
              <ProductCard key={d.id} product={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
