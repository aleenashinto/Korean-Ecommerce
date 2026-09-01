"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Award, Mail, ArrowRight, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-champagne-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-stone-400 mt-0.5">Complimentary on orders &gt; ₹999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6 text-champagne-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-stone-400 mt-0.5">Hassle-free doorstep pickups</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-champagne-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-stone-400 mt-0.5">256-bit encrypted payments</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-champagne-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Authentic Couture</h4>
              <p className="text-xs text-stone-400 mt-0.5">Certified premium fabrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-extrabold tracking-wider text-white">
              AURA<span className="text-brand-500">LUXE</span>
            </span>
          </Link>
          <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
            Curating exquisite contemporary dresses, timeless Indian couture, and modern silhouettes designed to make every woman feel radiant, confident, and celebrated.
          </p>

          {/* Newsletter Form */}
          <div className="pt-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-champagne-300 mb-2">
              Join the AuraLuxe VIP Circle
            </h5>
            {subscribed ? (
              <div className="p-3 bg-brand-950 border border-brand-800 rounded-xl text-xs text-brand-200">
                🎉 Welcome to VIP! Check your inbox for exclusive early access and secret seasonal drops.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 bg-stone-800/80 border border-stone-700 rounded-l-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-r-xl text-xs font-semibold flex items-center transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Shop</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop?category=dresses" className="hover:text-brand-400 transition-colors">Maxi & Midi Dresses</Link></li>
            <li><Link href="/shop?category=indian-wear" className="hover:text-brand-400 transition-colors">Sarees & Anarkalis</Link></li>
            <li><Link href="/shop?category=western-wear" className="hover:text-brand-400 transition-colors">Co-ords & Tailored Sets</Link></li>
            <li><Link href="/lookbook" className="hover:text-brand-400 transition-colors font-medium text-champagne-300">The Haute Lookbook ✨</Link></li>
            <li><Link href="/shop?is_new_arrival=true" className="hover:text-brand-400 transition-colors">New Season Arrivals</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/orders" className="hover:text-brand-400 transition-colors">Track Your Order</Link></li>
            <li><Link href="/faq" className="hover:text-brand-400 transition-colors font-medium text-champagne-300">FAQs & Shipping Policy</Link></li>
            <li><Link href="/account/style-profile" className="hover:text-brand-400 transition-colors">My AI Style Profile</Link></li>
            <li><Link href="/account?tab=returns" className="hover:text-brand-400 transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact Concierge Desk</Link></li>
          </ul>
        </div>

        {/* Brand & Legal */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Our Brand</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/about" className="hover:text-brand-400 transition-colors">The AuraLuxe Story</Link></li>
            <li><Link href="/about" className="hover:text-brand-400 transition-colors">Sustainable Craftsmanship</Link></li>
            <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Press & Collaborations</Link></li>
            <li><Link href="/login" className="hover:text-brand-400 transition-colors">Member Sign In</Link></li>
            <li><Link href="/admin" className="text-amber-400/80 hover:text-amber-300 font-medium transition-colors">Admin Portal 👑</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <p>&copy; 2026 AuraLuxe Fashion Technologies Inc. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Designed with <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500 inline" /> for modern fashion lovers.
        </p>
      </div>
    </footer>
  );
};
