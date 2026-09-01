"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LookbookPage() {
  const articles = [
    {
      id: 1,
      tag: "K-DRAMA ROMANCE EDIT",
      title: "5 Dreamy Floral & Chiffon Looks Inspired by K-Drama Leads",
      summary: "How to master the ethereal Korean romantic aesthetic: pairing airy georgette chiffons, subtle puff sleeves, and pastel hair ribbons for charming weekend dates.",
      coverImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
      featuredProduct: {
        name: "Cherry Blossom Floral Chiffon Midi Dress",
        price: "₹1,999",
        link: "/shop?category=k-drama-dresses",
      },
    },
    {
      id: 2,
      tag: "SEOUL MINIMALIST CAPSULE",
      title: "The Gangnam Corporate Edit: Tailored Tweed & Pleated Shirtdresses",
      summary: "Clean monochrome lines, structured bouclé pinafores layered over silk shirts, and waist-cinching belts designed for high-power Seoul elegance.",
      coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      featuredProduct: {
        name: "Seoul Minimalist Tweed Pinafore Dress",
        price: "₹2,799",
        link: "/shop?category=seoul-minimalist",
      },
    },
    {
      id: 3,
      tag: "MODERN HANBOK FUSION",
      title: "Traditional Korean Heritage Meets High-Street Runway Couture",
      summary: "Explore the art of Jeogori crossover wrap bodices and flowing organza chima skirts tailored for celebratory receptions and high-tea soirées.",
      coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      featuredProduct: {
        name: "Modern Hanbok Organza Wrap Midi Dress",
        price: "₹3,999",
        link: "/shop?category=modern-hanbok",
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Seoul Fashion Week Editorial</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
          The K-Fashion Lookbook
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Curated styling guides, K-Drama fashion breakdowns, and Seoul street style reports linking directly to our atelier collections.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-950">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-champagne-300 text-[10px] font-bold px-3 py-1 rounded-full font-mono shadow-md">
                  {item.tag}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>
            </div>

            {/* Shoppable Footer Card */}
            <div className="p-6 pt-0 border-t border-stone-100 mt-4">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] uppercase text-stone-400 font-mono font-bold block">Featured Piece</span>
                  <span className="text-xs font-bold text-stone-900 truncate block">{item.featuredProduct.name}</span>
                  <span className="text-xs font-bold text-brand-700 font-sans">{item.featuredProduct.price}</span>
                </div>
                <Link
                  href={item.featuredProduct.link}
                  className="bg-stone-900 hover:bg-brand-600 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-colors flex-shrink-0 flex items-center gap-1"
                >
                  <span>Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
