"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { ProductCard as ProductCardType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: ProductCardType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisting(true);
    try {
      await toggleWishlist(product.id);
    } catch (err: any) {
      alert(err.message || "Please log in to manage your wishlist");
    } finally {
      setIsWishlisting(false);
    }
  };

  const displayImage = isHovered && product.hover_image ? product.hover_image : product.primary_image;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-brand-300 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link href={`/product/${product.slug || product.id}`}>
          <img
            src={displayImage || "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount_percent > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-stone-900 text-champagne-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              NEW
            </span>
          )}
          {product.is_best_seller && (
            <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={isWishlisting}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
            isLiked
              ? "bg-rose-50 text-rose-600 shadow-md"
              : "bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600 shadow-sm"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-600" : ""}`} />
        </button>

        {/* Quick View Floating Action Bar on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <Link
            href={`/product/${product.slug || product.id}`}
            className="flex-1 bg-stone-900/90 hover:bg-brand-600 text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
          <span className="uppercase tracking-widest font-semibold text-[10px] text-brand-600">
            {product.category_name || "Dress"}
          </span>
          <div className="flex items-center gap-1 bg-stone-50 px-1.5 py-0.5 rounded text-stone-700 font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400">({product.review_count})</span>
          </div>
        </div>

        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-stone-900 font-sans">
            {formatPrice(product.selling_price)}
          </span>
          {product.mrp > product.selling_price && (
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>

        {/* Available Sizes & Colors hints */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1 truncate max-w-[140px]">
            <span className="text-stone-400">Sizes:</span>
            <span className="font-medium text-stone-700 truncate">{product.available_sizes.slice(0, 4).join(", ")}</span>
          </div>
          {product.in_stock ? (
            <span className="text-emerald-700 font-medium text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">In Stock</span>
          ) : (
            <span className="text-rose-600 font-medium text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};
