"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, wishlistCount } = useWishlist();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Saved Wishlist</h2>
        <p className="text-xs text-stone-500">Sign in to save items across devices and track price drops.</p>
        <Link href="/login?redirect=/wishlist" className="inline-block bg-brand-600 text-white text-xs font-semibold px-8 py-3 rounded-full">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Saved Styles</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            My Wishlist ({wishlistCount} Items)
          </h1>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
          Continue Exploring &rarr;
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Your wishlist is empty</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Click the heart icon on any dress you love to keep track of it here for later.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-8 py-3 rounded-full"
          >
            Explore Dresses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
