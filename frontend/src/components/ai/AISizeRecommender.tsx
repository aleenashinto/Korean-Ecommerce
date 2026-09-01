"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Ruler, ChevronRight, X } from "lucide-react";
import { api } from "@/lib/api";

interface AISizeRecommenderProps {
  productId: number;
  onSizeSelected?: (size: string) => void;
}

export const AISizeRecommender: React.FC<AISizeRecommenderProps> = ({ productId, onSizeSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bust, setBust] = useState(34);
  const [waist, setWaist] = useState(28);
  const [hips, setHips] = useState(38);
  const [height, setHeight] = useState(165);
  const [fitPref, setFitPref] = useState("regular");
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const data = await api.ai.sizeRecommend({
        product_id: productId,
        bust_inches: bust,
        waist_inches: waist,
        hip_inches: hips,
        height_cm: height,
        fit_preference: fitPref,
      });
      setResult(data);
    } catch (err) {
      console.error("Size prediction failed:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div>
      {/* Trigger Button next to size selector */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
        <span>Find My AI Fit</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">AI Intelligent Size Finder</h3>
                  <p className="text-[11px] text-stone-400">Custom tailored fit prediction based on your body dimensions</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePredict} className="space-y-4 text-xs">
              {/* Bust Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Bust Measurement</span>
                  <span className="font-mono text-brand-700 font-bold">{bust} inches</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={46}
                  value={bust}
                  onChange={(e) => setBust(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              {/* Waist Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Waist Measurement</span>
                  <span className="font-mono text-brand-700 font-bold">{waist} inches</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={42}
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              {/* Hips Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Hips Measurement</span>
                  <span className="font-mono text-brand-700 font-bold">{hips} inches</span>
                </div>
                <input
                  type="range"
                  min={32}
                  max={50}
                  value={hips}
                  onChange={(e) => setHips(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              {/* Fit Preference */}
              <div className="space-y-1.5 pt-1">
                <span className="block font-semibold text-stone-700">Fit Preference</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "snug", label: "Contoured (Snug)" },
                    { id: "regular", label: "Classic (Regular)" },
                    { id: "relaxed", label: "Flowy (Relaxed)" },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setFitPref(p.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                        fitPref === p.id
                          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPredicting}
                className="w-full bg-stone-900 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-champagne-300" />
                <span>{isPredicting ? "Calculating Silhouette..." : "Predict Optimal Size"}</span>
              </button>
            </form>

            {/* Prediction Result Display */}
            {result && (
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in duration-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recommended Fit: <strong className="text-sm font-sans underline">Size {result.recommended_size}</strong>
                  </span>
                  <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {result.confidence_score}% Match
                  </span>
                </div>

                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  {result.fit_analysis}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (onSizeSelected) onSizeSelected(result.recommended_size);
                    setIsOpen(false);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-center block transition-colors"
                >
                  Select Size {result.recommended_size} & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
