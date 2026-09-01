"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Search as SearchIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { Category, ProductCard as ProductCardType } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/product/FilterSidebar";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read URL query params
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const sort = searchParams.get("sort") || "featured";
  const size = searchParams.get("size") || "";
  const color = searchParams.get("color") || "";
  const fabric = searchParams.get("fabric") || "";
  const occasion = searchParams.get("occasion") || "";
  const min_price = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined;
  const max_price = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined;
  const min_discount = searchParams.get("min_discount") ? Number(searchParams.get("min_discount")) : undefined;
  const in_stock = searchParams.get("in_stock") === "true";
  const is_new_arrival = searchParams.get("is_new_arrival") === "true";
  const is_trending = searchParams.get("is_trending") === "true";
  const is_best_seller = searchParams.get("is_best_seller") === "true";
  const is_featured = searchParams.get("is_featured") === "true";

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const queryParams: Record<string, any> = {
          page: currentPage,
          limit: 12,
          sort,
        };
        if (q) queryParams.q = q;
        if (category) queryParams.category = category;
        if (subcategory) queryParams.subcategory = subcategory;
        if (size) queryParams.size = size;
        if (color) queryParams.color = color;
        if (fabric) queryParams.fabric = fabric;
        if (occasion) queryParams.occasion = occasion;
        if (min_price) queryParams.min_price = min_price;
        if (max_price) queryParams.max_price = max_price;
        if (min_discount) queryParams.min_discount = min_discount;
        if (in_stock) queryParams.in_stock = true;
        if (is_new_arrival) queryParams.is_new_arrival = true;
        if (is_trending) queryParams.is_trending = true;
        if (is_best_seller) queryParams.is_best_seller = true;
        if (is_featured) queryParams.is_featured = true;

        const data = await api.getProducts(queryParams);
        setProducts(data.items || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCatalog();
  }, [
    q,
    category,
    subcategory,
    sort,
    size,
    color,
    fabric,
    occasion,
    min_price,
    max_price,
    min_discount,
    in_stock,
    is_new_arrival,
    is_trending,
    is_best_seller,
    is_featured,
    currentPage,
  ]);

  const updateFilters = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params.set(k, String(v));
      } else {
        params.delete(k);
      }
    });
    params.set("page", "1");
    setCurrentPage(1);
    router.push(`/shop?${params.toString()}`);
  };

  const resetAllFilters = () => {
    router.push("/shop");
    setCurrentPage(1);
  };

  const activeFilterList = [
    q && { key: "q", label: `Search: "${q}"` },
    category && { key: "category", label: `Category: ${category}` },
    subcategory && { key: "subcategory", label: `Sub: ${subcategory}` },
    size && { key: "size", label: `Size: ${size}` },
    color && { key: "color", label: `Color: ${color}` },
    fabric && { key: "fabric", label: `Fabric: ${fabric}` },
    occasion && { key: "occasion", label: `Occasion: ${occasion}` },
    min_price && { key: "min_price", label: `Min ₹${min_price}` },
    max_price && { key: "max_price", label: `Max ₹${max_price}` },
    min_discount && { key: "min_discount", label: `${min_discount}%+ OFF` },
    in_stock && { key: "in_stock", label: "In Stock" },
  ].filter(Boolean) as { key: string; label: string }[];

  const currentFiltersObj = {
    category,
    size,
    color,
    fabric,
    occasion,
    min_price,
    max_price,
    min_discount,
    in_stock,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-600">The Catalog</span>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            {category ? `${category.replace("-", " ").toUpperCase()}` : "All Dresses & Outfits"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Showing {products.length} of {totalCount} luxury silhouettes
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filters ({activeFilterList.length})</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 shadow-sm">
            <span className="text-stone-400 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured & Curated</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-b border-stone-100">
          <span className="text-xs text-stone-400 font-medium mr-1">Active filters:</span>
          {activeFilterList.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              {f.label}
              <button
                onClick={() => updateFilters({ [f.key]: undefined })}
                className="p-0.5 hover:bg-brand-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetAllFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            categories={categories}
            filters={currentFiltersObj}
            onFilterChange={updateFilters}
            onReset={resetAllFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-stone-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">No matching dresses found</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We couldn't find products matching your selected filters. Try broadening your criteria or reset filters to browse our full collection.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl disabled:opacity-40 hover:bg-stone-50 transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-colors ${
                        currentPage === idx + 1
                          ? "bg-brand-600 text-white shadow-md shadow-brand-200"
                          : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl disabled:opacity-40 hover:bg-stone-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Slide Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-4/5 max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
              <h3 className="font-semibold text-stone-900 text-base">Filter Dresses</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              filters={currentFiltersObj}
              onFilterChange={updateFilters}
              onReset={resetAllFilters}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-stone-500">Loading dress catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
