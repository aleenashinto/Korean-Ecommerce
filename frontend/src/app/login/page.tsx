"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ShieldCheck, User as UserIcon, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const loggedUser = await login({ email: email.trim(), password });
      if (loggedUser.role_name === "ADMIN" || loggedUser.role_id === 2) {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-600">
            AuraLuxe Member Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
            Welcome Back
          </h1>
          <p className="text-xs text-stone-500">Sign in to your private account to manage your wardrobe & orders.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@example.com"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">Password</label>
              <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">Forgot password?</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-900 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Credentials Box for Portfolio Reviewers */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <p className="text-[11px] font-semibold text-stone-500 text-center uppercase tracking-wider">
            1-Click Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("user@auraluxe.com", "User@123")}
              className="p-2 bg-stone-50 hover:bg-brand-50 border border-stone-200 hover:border-brand-300 rounded-xl text-left transition-colors"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-stone-800">
                <UserIcon className="w-3 h-3 text-brand-600" /> Customer
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5 truncate">user@auraluxe.com</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin@auraluxe.com", "Admin@123")}
              className="p-2 bg-amber-50/60 hover:bg-amber-100 border border-amber-200 hover:border-amber-400 rounded-xl text-left transition-colors"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900">
                <ShieldCheck className="w-3 h-3 text-amber-600" /> Admin 👑
              </div>
              <p className="text-[10px] text-amber-700 mt-0.5 truncate">admin@auraluxe.com</p>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-stone-500">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
