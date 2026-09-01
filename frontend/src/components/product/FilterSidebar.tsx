"use client";

import React from "react";
import { Filter, X, Check, RotateCcw } from "lucide-react";
import { Category } from "@/types";

interface FilterState {
  category?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  fabric?: string;
  occasion?: string;
  brand?: string;
  min_rating?: number;
  min_discount?: number;
  in_stock?: boolean;
}

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  onCloseMobile,
}) => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "FREE SIZE"];
  const fabrics = ["Silk", "Georgette", "Linen", "Velvet", "Organza", "Satin", "Crepe Poly"];
  const occasions = ["Party", "Casual", "Wedding", "Vacation", "Office", "Festive"];
  const discountOptions = [
    { label: "10% or more", value: 10 },
    { label: "20% or more", value: 20 },
    { label: "30% or more", value: 30 },
    { label: "40% or more", value: 40 },
  ];

  const colors = [
    { name: "Pink", hex: "#FFB6C1" },
    { name: "Blue", hex: "#87CEEB" },
    { name: "Green", hex: "#9DC183" },
    { name: "Emerald", hex: "#004B49" },
    { name: "Wine", hex: "#722F37" },
    { name: "Noir", hex: "#1A1A1A" },
    { name: "Beige", hex: "#E6D5C3" },
    { name: "Amber", hex: "#FFBF00" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gold", hex: "#FFFDD0" },
    { name: "Rose Gold", hex: "#B76E79" },
  ];

  const toggleSize = (s: string) => {
    const currentSizes = filters.size ? filters.size.split(",") : [];
    let updated: string[];
    if (currentSizes.includes(s)) {
      updated = currentSizes.filter((x) => x !== s);
    } else {
      updated = [...currentSizes, s];
    }
    onFilterChange({ ...filters, size: updated.length ? updated.join(",") : undefined });
  };

  const toggleColor = (c: string) => {
    const currentColors = filters.color ? filters.color.split(",") : [];
    let updated: string[];
    if (currentColors.includes(c)) {
      updated = currentColors.filter((x) => x !== c);
    } else {
      updated = [...currentColors, c];
    }
    onFilterChange({ ...filters, color: updated.length ? updated.join(",") : undefined });
  };

  const selectedSizes = filters.size ? filters.size.split(",") : [];
  const selectedColors = filters.color ? filters.color.split(",") : [];

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-sm text-stone-900">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category Section */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ ...filters, category: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !filters.category ? "bg-brand-50 text-brand-700 font-semibold" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.slug })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.category === cat.slug
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-stone-400 font-mono">({cat.product_count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                min_price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                max_price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Size
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => {
            const active = selectedSizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Color Shades
        </h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleColor(c.name)}
                title={c.name}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  active ? "border-brand-600 ring-2 ring-brand-300 scale-110" : "border-stone-300 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {active && (
                  <Check className={`w-3.5 h-3.5 ${c.name === "White" || c.name === "Gold" ? "text-stone-900" : "text-white"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Fabric
        </h4>
        <div className="space-y-1">
          {fabrics.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange({ ...filters, fabric: filters.fabric === f ? undefined : f })}
              className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.fabric === f ? "bg-brand-50 text-brand-700 font-semibold" : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Occasion
        </h4>
        <div className="space-y-1">
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => onFilterChange({ ...filters, occasion: filters.occasion === occ ? undefined : occ })}
              className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.occasion === occ ? "bg-brand-50 text-brand-700 font-semibold" : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
          Discount
        </h4>
        <div className="space-y-1">
          {discountOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ ...filters, min_discount: filters.min_discount === opt.value ? undefined : opt.value })}
              className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.min_discount === opt.value ? "bg-brand-50 text-brand-700 font-semibold" : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-2 border-t border-stone-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.in_stock}
            onChange={(e) => onFilterChange({ ...filters, in_stock: e.target.checked ? true : undefined })}
            className="w-4 h-4 text-brand-600 rounded border-stone-300 focus:ring-brand-500"
          />
          <span className="text-xs font-medium text-stone-700">In Stock Items Only</span>
        </label>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full lg:hidden bg-brand-600 text-white text-xs font-semibold py-2.5 rounded-xl mt-4"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};
