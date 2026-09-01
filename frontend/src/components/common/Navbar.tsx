"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Package,
  RotateCcw,
  LogOut,
  SlidersHorizontal,
  Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { VisualSearchModal } from "@/components/ai/VisualSearchModal";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data)).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "New Arrivals", href: "/shop?is_new_arrival=true" },
    { label: "Collections", href: "/shop?is_featured=true" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Offers", href: "/shop?sort=discount" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all duration-200">
      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-brand-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex flex-col items-center">
              <div className="flex items-center gap-1">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-stone-900 group-hover:text-brand-600 transition-colors">
                  SEOUL<span className="text-brand-600">LUXE</span>
                </span>
                <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-1.5 py-0.5 rounded font-mono">
                  서울
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-medium -mt-0.5">
                K-Dress Atelier • Seoul
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-600 ${
                  pathname === link.href ? "text-brand-600 font-semibold" : "text-stone-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
              onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium tracking-wide text-stone-700 hover:text-brand-600 transition-colors py-2"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isCategoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-stone-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                    Featured Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
                      onClick={() => setIsCategoriesDropdownOpen(false)}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full font-mono">
                        {cat.product_count}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t border-stone-100 mt-2 pt-2 px-3">
                    <Link
                      href="/shop"
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 block"
                      onClick={() => setIsCategoriesDropdownOpen(false)}
                    >
                      View All Products &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-600 ${
                  pathname === link.href ? "text-brand-600 font-semibold" : "text-stone-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Visual Search AI Camera */}
            <button
              onClick={() => setIsVisualSearchOpen(true)}
              className="p-2 text-stone-700 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors relative group"
              title="AI Visual Search (Upload Photo)"
              aria-label="AI Visual Search"
            >
              <Camera className="w-5 h-5 text-brand-600" />
              <span className="hidden md:inline absolute -top-1 -right-1 bg-brand-600 text-white text-[8px] font-bold px-1 rounded-full font-mono">
                AI
              </span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-700 hover:text-brand-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-stone-700 hover:text-brand-600 hover:bg-stone-100 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-stone-700 hover:text-brand-600 hover:bg-stone-100 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account / User Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 border border-stone-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold font-mono">
                    {user.first_name[0]}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-stone-800 max-w-[80px] truncate">
                    {user.first_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:inline" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-2 rounded-full transition-all shadow-sm shadow-brand-200"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Account Dropdown */}
              {isAccountMenuOpen && user && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-500">Signed in as</p>
                    <p className="text-sm font-semibold text-stone-900 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Admin Account
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="px-2 py-1 bg-amber-50/60 border-b border-amber-100">
                      <Link
                        href="/admin"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </div>
                  )}

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-brand-600"
                    >
                      <UserIcon className="w-4 h-4 text-stone-400" /> My Profile
                    </Link>
                    <Link
                      href="/account/style-profile"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-brand-700 hover:bg-brand-50 font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-brand-600" /> My AI Style Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-brand-600"
                    >
                      <Package className="w-4 h-4 text-stone-400" /> My Orders & Tracking
                    </Link>
                    <Link
                      href="/account?tab=returns"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-brand-600"
                    >
                      <RotateCcw className="w-4 h-4 text-stone-400" /> Returns & Refunds
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-brand-600"
                    >
                      <Heart className="w-4 h-4 text-stone-400" /> Wishlist ({wishlistCount})
                    </Link>
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instant Search Bar Slide Down */}
        {isSearchOpen && (
          <div className="pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search dresses, fabrics, occasions (e.g. Floral maxi, velvet, georgette)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-24 py-3 bg-stone-50 border border-stone-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white shadow-inner transition-all"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="font-serif text-xl font-bold text-stone-900">
                AURA<span className="text-brand-600">LUXE</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-stone-800 hover:text-brand-600 border-b border-stone-50"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Categories</p>
                <div className="space-y-1 pl-2">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1.5 text-xs text-stone-600 hover:text-brand-600"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto border-t border-stone-200 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-stone-600">
                    Logged in as <strong>{user.first_name}</strong>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center text-xs font-bold text-amber-900 bg-amber-100 py-2 rounded-lg"
                    >
                      👑 Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-xs font-semibold text-rose-600 py-2 border border-rose-200 rounded-lg hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-sm font-semibold text-white bg-brand-600 py-2.5 rounded-lg shadow-sm"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Visual Search Modal */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </header>
  );
};
