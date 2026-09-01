"use client";

import React from "react";
import { Sparkles, Truck, Tag } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-stone-900 via-brand-900 to-stone-900 text-white text-xs py-2 px-4 border-b border-brand-800/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-champagne-300 animate-pulse" />
          <span>NEW SEASON EDIT: Use code <strong className="text-champagne-300 bg-white/10 px-1.5 py-0.5 rounded tracking-widest font-mono">WELCOME10</strong> for 10% OFF</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-stone-300 text-[11px] tracking-wide">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3 h-3 text-brand-300" /> Free Express Delivery on orders over ₹999
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-brand-300" /> Easy 7-Day Doorstep Returns
          </span>
        </div>
      </div>
    </div>
  );
};
