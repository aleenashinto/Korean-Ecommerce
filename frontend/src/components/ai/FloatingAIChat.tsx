"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  recommended_products?: any[];
  suggested_prompts?: string[];
}

export const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "✨ **Annyeonghaseyo! I'm Minji (민지), your Seoul AI Virtual Stylist.**\n\nLooking for the perfect dress for a romantic K-drama date, Gangnam cocktail night, or Hongdae street fit? Tell me your occasion or budget and I'll curate your Korean look!",
      suggested_prompts: [
        "K-Drama floral chiffon midi dresses",
        "Seoul minimalist tweed office dress under ₹3000",
        "Modern Hanbok fusion wrap dresses",
        "Track my order #ALX10025"
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const newMsgs: ChatMsg[] = [...messages, { role: "user", content: query }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.ai.chat(
        newMsgs.map((m) => ({ role: m.role, content: m.content }))
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.reply,
          recommended_products: response.recommended_products,
          suggested_prompts: response.suggested_prompts,
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having a brief connection pause. Please try asking again in a moment!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-stone-900 via-brand-900 to-stone-900 text-white px-4 py-3.5 rounded-full shadow-2xl hover:shadow-brand-900/50 hover:scale-105 transition-all duration-300 border border-brand-500/40"
          aria-label="Open AI Virtual Stylist"
        >
          <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center border border-champagne-300/40">
            <Sparkles className="w-4 h-4 text-champagne-300 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block pr-1">
            <span className="block text-[9px] uppercase tracking-widest text-champagne-300 font-bold -mb-0.5">
              Seoul AI Stylist
            </span>
            <span className="block text-xs font-bold text-white">
              Ask Minji (민지)
            </span>
          </div>
        </button>
      </div>

      {/* Slide-Up Chat Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 via-brand-950 to-stone-900 p-4 text-white flex items-center justify-between border-b border-brand-900/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-600/60 border border-champagne-300/50 flex items-center justify-center shadow-inner">
                <Sparkles className="w-4 h-4 text-champagne-300" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Minji (민지)</span>
                  <span className="text-[10px] bg-champagne-300/20 text-champagne-300 font-mono px-1.5 py-0.2 rounded font-normal">
                    Seoul Stylist
                  </span>
                </h3>
                <p className="text-[10px] text-stone-300 font-light">Korean Atelier Fashion & Fit Concierge</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`space-y-2.5 max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-brand-600 text-white rounded-br-none shadow-sm"
                        : "bg-white text-stone-800 border border-stone-200/80 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>

                  {/* Recommended Products Carousel if returned */}
                  {m.recommended_products && m.recommended_products.length > 0 && (
                    <div className="space-y-2 pt-1 w-full">
                      {m.recommended_products.map((p: any) => (
                        <div
                          key={p.id}
                          className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3 hover:border-brand-300 transition-colors"
                        >
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-14 h-16 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-brand-600 font-mono block">
                              {p.category}
                            </span>
                            <h4 className="font-semibold text-stone-900 truncate text-[11px]">{p.name}</h4>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="font-bold text-stone-900 font-sans">{formatPrice(p.price)}</span>
                              {p.mrp > p.price && (
                                <span className="text-[10px] text-stone-400 line-through">{formatPrice(p.mrp)}</span>
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/product/${p.slug || p.id}`}
                            onClick={() => setIsOpen(false)}
                            className="bg-stone-900 hover:bg-brand-600 text-white p-2 rounded-xl text-xs flex-shrink-0 transition-colors"
                            title="View Dress"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Prompt Chips */}
                  {m.suggested_prompts && m.suggested_prompts.length > 0 && idx === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.suggested_prompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="text-[11px] bg-white hover:bg-brand-50 text-stone-700 hover:text-brand-700 border border-stone-200/80 px-2.5 py-1 rounded-full transition-colors text-left font-medium"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic">
                <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-brand-600 animate-spin" />
                </div>
                <span>Aura is styling your recommendation...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-stone-200 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask styling advice, budget dresses, sizes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none placeholder-stone-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-stone-200 text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
