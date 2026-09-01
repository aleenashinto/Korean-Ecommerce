"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2, X, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { Banner } from "@/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tag, setTag] = useState("NEW SEASON");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80");
  const [buttonText, setButtonText] = useState("Explore Edit");
  const [buttonLink, setButtonLink] = useState("/shop");

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getBanners();
      setBanners(data);
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createBanner({
        title,
        subtitle,
        tag,
        image_url: imageUrl,
        button_text: buttonText,
        button_link: buttonLink,
        display_order: banners.length + 1,
        is_active: true,
      });
      alert("🎉 Banner created successfully!");
      setIsModalOpen(false);
      setTitle("");
      setSubtitle("");
      loadBanners();
    } catch (err: any) {
      alert(err.message || "Failed to create banner");
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.admin.deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
            Storefront Merchandising
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            Homepage Banner Management ({banners.length})
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Hero Banner
        </button>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-stone-400">Loading banners...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm space-y-3 p-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-950">
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover opacity-85" />
                {b.tag && (
                  <span className="absolute top-2 left-2 bg-brand-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {b.tag}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">{b.title}</h3>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{b.subtitle}</p>
                <div className="mt-2 text-[10px] text-brand-600 font-semibold font-mono">
                  Link: {b.button_link} ({b.button_text})
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono text-[10px]">Order: #{b.display_order}</span>
                <button
                  onClick={() => handleDeleteBanner(b.id)}
                  className="text-rose-600 hover:text-rose-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Add Homepage Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Couture Edit 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subtitle Description</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted silks and embroidered Anarkalis"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tag Pill</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">High-Res Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Link</label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
              >
                Publish Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
