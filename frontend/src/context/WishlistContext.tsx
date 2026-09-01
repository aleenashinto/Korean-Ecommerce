"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WishlistItem } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (!user) {
      throw new Error("Please log in to manage your wishlist.");
    }
    setIsLoading(true);
    try {
      const res = await api.toggleWishlist(productId);
      await refreshWishlist();
      return res.in_wishlist;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await api.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } finally {
      setIsLoading(false);
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isLoading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
