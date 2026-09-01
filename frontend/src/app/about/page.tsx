"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Seoul Atelier Story</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
          Curating Korean Women's Fashion with Timeless Seoul Grace
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed">
          Bringing authentic Dongdaemun runway tailoring, K-Drama romantic silhouettes, and modern Hanbok fusion directly to your wardrobe.
        </p>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
            alt="SeoulLuxe Korean Fashion Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            From Seoul Runways to Your Daily OOTD
          </h2>
          <p>
            At <strong>SEOULLUXE (서울룩스)</strong>, we are passionate about the understated elegance, poetic drape, and flattering proportions that define authentic Korean fashion.
          </p>
          <p>
            Whether it's the dreamy floral chiffon dresses seen on your favorite K-Drama leads, structured Gangnam bouclé tweed pinafores, oversized Hongdae babydoll minis, or contemporary Hanbok Jeogori wraps, our ateliers craft every piece with premium breathable fabrics and delicate detailing.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full transition-colors shadow-lg"
            >
              <span>Explore The Korean Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-stone-200">
        <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm space-y-2">
          <Award className="w-8 h-8 text-brand-600" />
          <h3 className="font-serif font-bold text-base text-stone-900">Authentic Seoul Tailoring</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            High-twist Korean crepes, bouclé tweeds, and airy georgette chiffons cut with signature Ulzzang proportions.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm space-y-2">
          <ShieldCheck className="w-8 h-8 text-brand-600" />
          <h3 className="font-serif font-bold text-base text-stone-900">AI Korean Sizing Engine</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Integrated body measurement predictor mapping your dimensions into Korean Standard Sizing (44 through 99 / XS–XXL).
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm space-y-2">
          <Heart className="w-8 h-8 text-brand-600" />
          <h3 className="font-serif font-bold text-base text-stone-900">Direct Express Delivery</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Fast dispatch with 7-day doorstep exchanges and hassle-free returns on all Korean dress collections.
          </p>
        </div>
      </div>
    </div>
  );
}
