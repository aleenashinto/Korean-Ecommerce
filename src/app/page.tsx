"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Award,
  Heart
} from "lucide-react";
import { api } from "@/lib/api";
import { Banner, Category, ProductCard as ProductCardType } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductCardType[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductCardType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [bannersData, catsData, trendData, newArrivalsData, bestData] = await Promise.all([
          api.getBanners(),
          api.getCategories(),
          api.getProducts({ is_trending: true, limit: 4 }),
          api.getProducts({ is_new_arrival: true, limit: 4 }),
          api.getProducts({ is_best_seller: true, limit: 4 }),
        ]);

        setBanners(bannersData);
        setCategories(catsData);
        setTrendingProducts(trendData.items || []);
        setNewArrivals(newArrivalsData.items || []);
        setBestSellers(bestData.items || []);
      } catch (err) {
        console.error("Failed to load home page content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Auto slide hero banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const activeBanner = banners[currentBannerIndex] || {
    title: "The Haute Summer Collection 2026",
    subtitle: "Fluid silhouettes, breathable European linen, and dreamy botanical florals.",
    tag: "NEW SEASON ARRIVALS",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    button_text: "Explore Collection",
    button_link: "/shop?category=dresses",
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO BANNER CAROUSEL */}
      <section className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-stone-950">
        <div className="absolute inset-0">
          <img
            src={activeBanner.image_url}
            alt={activeBanner.title}
            className="w-full h-full object-cover object-center opacity-85 scale-105 animate-fade transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {activeBanner.tag && (
              <div className="inline-flex items-center gap-2 bg-brand-500/30 border border-brand-400/40 text-champagne-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                {activeBanner.tag}
              </div>
            )}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              {activeBanner.title}
            </h1>
            <p className="text-stone-300 text-sm sm:text-lg font-light leading-relaxed max-w-lg">
              {activeBanner.subtitle}
            </p>
            <div className="pt-2 sm:pt-4 flex flex-wrap gap-4 items-center">
              <Link
                href={activeBanner.button_link || "/shop"}
                className="bg-white text-stone-900 hover:bg-brand-600 hover:text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-stone-950/50 flex items-center gap-2"
              >
                <span>{activeBanner.button_text || "Shop Collection"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?sort=discount"
                className="border border-white/40 hover:border-white text-white hover:bg-white/10 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm transition-all"
              >
                Special Offers &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators & Controls */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-3">
            <button
              onClick={() =>
                setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)
              }
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 flex items-center justify-center backdrop-blur-md transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/60 backdrop-blur-md text-xs text-white font-mono">
              <span>{currentBannerIndex + 1}</span>
              <span className="text-stone-500">/</span>
              <span>{banners.length}</span>
            </div>
            <button
              onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 flex items-center justify-center backdrop-blur-md transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-600">Curated Wardrobes</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Explore handcrafted pieces crafted for every mood, season, and grand celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={cat.image_url || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
              
              <div className="absolute inset-x-5 bottom-5 flex flex-col justify-end text-white">
                <span className="text-[11px] font-mono uppercase tracking-widest text-champagne-300 font-semibold mb-1">
                  {cat.product_count} Styles
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-champagne-200 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 mt-1 opacity-90">
                  {cat.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-champagne-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING DRESSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>In High Demand</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Trending Right Now
            </h2>
          </div>
          <Link
            href="/shop?is_trending=true"
            className="text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-brand-950 to-stone-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-brand-900/50">
          <div className="max-w-xl space-y-3 sm:space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-champagne-300">
              Seoul Atelier Welcome Gift
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Get 10% OFF Your First Korean Dress
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Experience the grace of authentic Seoul fashion. Apply code <span className="text-champagne-300 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">SEOUL10</span> at checkout to unlock your private discount.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/shop"
              className="bg-champagne-300 hover:bg-champagne-400 text-stone-950 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/shop?sort=discount"
              className="border border-white/30 hover:border-white text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              View All Coupons
            </Link>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Runway</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              New Season Arrivals
            </h2>
          </div>
          <Link
            href="/shop?is_new_arrival=true"
            className="text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>Explore All New Styles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. BEST SELLERS EDIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Most Loved Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?is_best_seller=true"
            className="text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS SHOWCASE */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-600">Client Stories</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
              Loved by Thousands of Women
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <h4 className="font-semibold text-sm text-stone-900">“The drape and fabric exceeded all expectations!”</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                I wore the Enchanted Floral Tiered Maxi to my sister's garden engagement. The fabric breathes so nicely even under warm afternoon sun!
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">Ananya Sharma</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <h4 className="font-semibold text-sm text-stone-900">“Stunning Korean tailoring & fast delivery”</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                The pleated midi dress is now my go-to office staple. The structure is flawless, and it arrived within 3 days in luxurious packaging.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">Pooja Venkatesh</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <h4 className="font-semibold text-sm text-stone-900">“Royal Anarkali worthy of a luxury boutique”</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                The zari embroidery on the pure organza set looks even more mesmerizing in real life. True couture craftsmanship at honest pricing.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">Radhika Mehra</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
