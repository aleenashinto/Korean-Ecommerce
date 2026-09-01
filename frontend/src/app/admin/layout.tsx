"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Package,
  Users,
  Boxes,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  RotateCcw,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || (!isAdmin && user.role_id !== 2)) {
        router.push("/login?redirect=/admin");
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-300 text-xs font-mono">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!user || (!isAdmin && user.role_id !== 2)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-white p-6 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 animate-pulse" />
        <h2 className="font-serif text-2xl font-bold">Admin Privileges Required</h2>
        <p className="text-xs text-stone-400 max-w-sm">
          Please log in with the administrator account (<strong className="text-amber-400">admin@auraluxe.com</strong>) to access this portal.
        </p>
        <Link href="/login" className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "AI Insights", href: "/admin/ai-insights", icon: Sparkles },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "Returns", href: "/admin/returns", icon: RotateCcw },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold text-white">AURA<span className="text-brand-500">LUXE</span></span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-1 text-stone-300">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-stone-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <Link href="/admin" className="group">
            <span className="font-serif text-xl font-extrabold text-white tracking-wider">
              AURA<span className="text-brand-500">LUXE</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-amber-400 font-bold -mt-0.5">
              Admin Portal 👑
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? "bg-brand-600 text-white shadow-md shadow-brand-900/40"
                    : "text-stone-400 hover:text-white hover:bg-stone-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-stone-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Store
            </span>
            <span className="text-[10px] text-stone-500 font-mono">↗</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
