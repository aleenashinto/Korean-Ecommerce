"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80");

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCategory({
        name,
        slug: slug.trim().toLowerCase() || name.trim().toLowerCase().replace(/\s+/g, "-"),
        description,
        image_url: imageUrl,
        is_active: true,
      });
      alert("🎉 Category created successfully!");
      setIsModalOpen(false);
      setName("");
      setSlug("");
      setDescription("");
      loadCategories();
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.admin.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
            Taxonomy Structure
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-stone-400">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm p-4 flex flex-col justify-between space-y-3"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                <img src={c.image_url || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"} alt={c.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-stone-900">{c.name}</h3>
                  <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                    {c.product_count} Products
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">{c.description}</p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-mono text-[10px]">slug: {c.slug}</span>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
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
              <h3 className="font-serif text-lg font-bold text-stone-900">Create New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resort & Vacation Dresses"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. resort-dresses"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of styles in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
