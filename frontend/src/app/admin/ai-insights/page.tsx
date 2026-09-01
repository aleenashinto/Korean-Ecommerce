"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  TrendingUp,
  ShieldAlert,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  BarChart3,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminAIInsightsPage() {
  const [demandTrends, setDemandTrends] = useState([
    { category: "Dresses (Maxi & Midi)", demandScore: 94, trend: "+28% WoW", priority: "Restock High", color: "bg-emerald-500" },
    { category: "Korean Western Co-ords", demandScore: 88, trend: "+42% WoW", priority: "Trending Viral", color: "bg-blue-500" },
    { category: "Indian Festive Organza", demandScore: 82, trend: "+19% WoW", priority: "Wedding Season Peak", color: "bg-amber-500" },
    { category: "Silk Satin Gowns", demandScore: 76, trend: "+14% WoW", priority: "Steady Demand", color: "bg-purple-500" },
  ]);

  const [topStylistQueries, setTopStylistQueries] = useState([
    { query: "Floral maxi dresses under ₹3000", count: 184, conversionRate: "14.2%" },
    { query: "Cocktail party attire for evening gala", count: 142, conversionRate: "18.6%" },
    { query: "Where is my order tracking code?", count: 96, conversionRate: "N/A (Fulfillment)" },
    { query: "Korean minimalist blazer co-ord in M", count: 88, conversionRate: "22.1%" },
    { query: "7-day doorstep exchange procedure", count: 64, conversionRate: "N/A (Care FAQ)" },
  ]);

  const [fraudLogs, setFraudLogs] = useState([
    { id: "ALX10028", customer: "Pooja Verma", amount: 6999, method: "Cash on Delivery", score: 85, level: "HIGH", reason: "Multiple bulk COD attempts within 1 hour with unverified address" },
    { id: "ALX10025", customer: "Ananya Sharma", amount: 1888, method: "Instant UPI", score: 10, level: "LOW", reason: "Verified prepaid payment with trusted phone history" },
    { id: "ALX10022", customer: "Riya Sen", amount: 3778, method: "Debit Card", score: 15, level: "LOW", reason: "Standard single purchase transaction" },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
              Machine Learning Telemetry
            </span>
            <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
              Live Real-Time
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            AI Intelligence & Demand Insights
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Aura RAG Engine Active</span>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Virtual Stylist Conversations</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-sans">1,428</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 92.4% Automated Resolution Rate
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">AI Reco Click-Through</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-sans">24.8%</p>
          <p className="text-[11px] text-stone-400">Complete-The-Look bundle conversion</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">AI Visual Searches</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-sans">582</p>
          <p className="text-[11px] text-stone-400">Inspiration photos matched via CLIP</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Fraud Flagged Orders</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-sans">3</p>
          <p className="text-[11px] text-rose-600 font-semibold">1 High-risk COD order blocked</p>
        </div>
      </div>

      {/* Row 2: Demand Forecasting & Stylist Query Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Demand Forecasting by Category (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                AI Category Demand Forecasting
              </h3>
              <p className="text-xs text-stone-400">Predicted sell-through rates based on browse velocity & search spikes</p>
            </div>
            <BarChart3 className="w-4 h-4 text-stone-400" />
          </div>

          <div className="space-y-4">
            {demandTrends.map((d) => (
              <div key={d.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{d.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold font-mono">{d.trend}</span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono font-bold">
                      {d.priority}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-500`}
                    style={{ width: `${d.demandScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stylist & Semantic Search Queries (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Top AI Stylist Conversations
            </h3>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topStylistQueries.map((q, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 truncate max-w-[200px]">"{q.query}"</span>
                  <span className="font-bold font-mono text-stone-500 text-[11px]">{q.count} chats</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>Cart Conversion:</span>
                  <strong className="text-emerald-700 font-mono">{q.conversionRate}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: AI Fraud Risk Audit Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>AI Fraud Detection & Suspicious COD Log</span>
            </h3>
            <p className="text-xs text-stone-400">Automated risk scores calculated on checkout velocity and address validation</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-brand-600 hover:underline">
            Manage Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Value</th>
                <th className="pb-3 font-semibold">Payment Method</th>
                <th className="pb-3 font-semibold">Calculated Risk</th>
                <th className="pb-3 font-semibold">Risk Analysis Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {fraudLogs.map((f) => (
                <tr key={f.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-stone-900">#{f.id}</td>
                  <td className="py-3.5 font-medium text-stone-800">{f.customer}</td>
                  <td className="py-3.5 font-bold font-sans text-stone-900">{formatPrice(f.amount)}</td>
                  <td className="py-3.5 font-medium text-stone-700">{f.method}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      f.level === "HIGH" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {f.level} ({f.score}/100)
                    </span>
                  </td>
                  <td className="py-3.5 text-stone-600 text-[11px] max-w-md">{f.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
