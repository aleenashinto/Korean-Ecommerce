"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ChevronUp, Truck, RotateCcw, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("shipping");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: Record<string, { q: string; a: string }[]> = {
    shipping: [
      {
        q: "What are your delivery timelines across India?",
        a: "Metro cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai) receive express delivery within 2–3 business days. All other locations across India are delivered within 4–6 business days via our premium logistics partners."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! All orders above ₹999 qualify for complimentary express delivery across India. For orders below ₹999, a nominal flat delivery fee of ₹99 applies."
      },
      {
        q: "How can I track my order live?",
        a: "As soon as your order is dispatched, you will receive an AWB tracking code via SMS and email. You can also track your shipment in real-time under 'My Orders' or simply ask our AI Virtual Stylist in the bottom chat bubble."
      }
    ],
    returns: [
      {
        q: "What is your return and exchange policy?",
        a: "We offer a 7-day doorstep return and size exchange policy on all unworn dresses with original tags intact. Simply navigate to 'My Orders', click 'Return / Exchange', and our courier will collect the package directly from your address."
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds for prepaid orders (UPI/Card/NetBanking) are credited back to the original payment source within 3–5 business days after inspection. For Cash on Delivery orders, refunds are instantly transferred via UPI or bank transfer."
      }
    ],
    sizing: [
      {
        q: "How does your AI Size Recommender work?",
        a: "Our AI Size Finder analyzes your body dimensions (bust, waist, hips, and height) along with your preferred fit (Snug, Regular, or Relaxed) and cross-references each garment's fabric stretch coefficient to recommend your optimal silhouette with 95%+ confidence."
      },
      {
        q: "What size range do you cater to?",
        a: "We design inclusive patterns ranging from XS through XXL, with true-to-size dimensional grading tailored for Indian and Asian body proportions."
      }
    ],
    payments: [
      {
        q: "Is it safe to pay online at AuraLuxe?",
        a: "Absolutely. All transactions are encrypted with 256-bit SSL encryption and processed through RBI-approved PCI-DSS Level 1 compliant payment gateways. We never store your full card details or UPI PINs."
      },
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "Yes, Cash on Delivery is available for most pincodes across India for orders up to ₹10,000."
      }
    ]
  };

  const tabs = [
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
    { id: "returns", label: "7-Day Returns & Exchanges", icon: RotateCcw },
    { id: "sizing", label: "AI Sizing & Fit", icon: Sparkles },
    { id: "payments", label: "Payments & Security", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-600 font-mono">
          Customer Care Knowledgebase
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-stone-500">
          Everything you need to know about our atelier dresses, bespoke sizing, express dispatch, and doorstep returns.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setOpenIndex(0);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-stone-900 text-white shadow-md scale-102"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm divide-y divide-stone-100">
        {faqData[activeTab].map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-stone-900 hover:text-brand-600 transition-colors"
              >
                <span>{item.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-brand-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="pt-3 text-xs text-stone-600 leading-relaxed animate-in fade-in duration-150">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Concierge Strip */}
      <div className="bg-gradient-to-r from-stone-900 via-brand-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-lg font-bold text-champagne-300">Still have a question?</h3>
          <p className="text-xs text-stone-300">Our styling concierge is available 7 days a week from 9 AM to 9 PM IST.</p>
        </div>
        <Link
          href="/contact"
          className="bg-white hover:bg-champagne-300 text-stone-950 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-colors flex items-center gap-2 flex-shrink-0 shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Concierge</span>
        </Link>
      </div>
    </div>
  );
}
