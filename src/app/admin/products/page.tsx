"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Sparkles,
  ShoppingBag,
  Check,
  Eye,
  SlidersHorizontal
} from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface AdminProductItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category_name?: string;
  mrp: number;
  selling_price: number;
  discount_percent: number;
  stock_total: number;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  rating: number;
  review_count: number;
  image?: string;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Create Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [brand, setBrand] = useState("AuraLuxe");
  const [mrp, setMrp] = useState<number>(2999);
  const [sellingPrice, setSellingPrice] = useState<number>(1799);
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("Georgette");
  const [pattern, setPattern] = useState("Floral");
  const [fit, setFit] = useState("Fit & Flare");
  const [occasion, setOccasion] = useState("Party");
  const [careInstructions, setCareInstructions] = useState("Hand wash in cold water or dry clean.");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80");
  
  // Variants Builder
  const [variantColor, setVariantColor] = useState("Rose Pink");
  const [variantColorHex, setVariantColorHex] = useState("#FFB6C1");
  const [variantSizes, setVariantSizes] = useState([
    { size: "S", stock: 10 },
    { size: "M", stock: 15 },
    { size: "L", stock: 8 },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  const handleGenerateAICopy = async () => {
    if (!name.trim()) {
      alert("Please enter a dress name first.");
      return;
    }
    setIsGeneratingCopy(true);
    try {
      const res = await api.ai.generateCopy({
        product_name: name,
        fabric,
        occasion,
        fit,
      });
      setDescription(res.luxury_description);
      alert("✨ AI generated luxury product description and styling attributes!");
    } catch (err: any) {
      alert(err.message || "Failed to generate AI copy");
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        api.admin.getProducts({ q: searchQuery || undefined }),
        api.getCategories(),
      ]);
      setProducts(prodsData.items || []);
      setCategories(catsData);
      if (catsData.length > 0) setCategoryId(catsData[0].id);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const variantsPayload = variantSizes.map((vs) => ({
        color_name: variantColor,
        color_code: variantColorHex,
        size: vs.size,
        stock_quantity: vs.stock,
      }));

      await api.admin.createProduct({
        name,
        sku,
        category_id: categoryId,
        brand,
        mrp,
        selling_price: sellingPrice,
        description,
        fabric,
        pattern,
        fit,
        occasion,
        care_instructions: careInstructions,
        is_featured: true,
        is_published: true,
        images: [{ image_url: imageUrl, is_primary: true }],
        variants: variantsPayload,
      });

      alert("🎉 Product created successfully with stock variants!");
      setIsModalOpen(false);
      // Reset form
      setName("");
      setSku("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    try {
      await api.admin.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
            Dresses & Products ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dress (Studio)</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search by dress name, SKU (e.g. ALX-DR-001), or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-stone-800 focus:outline-none placeholder-stone-400"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                <th className="pb-3 font-semibold">Dress Details</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Pricing</th>
                <th className="pb-3 font-semibold">Total Stock</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80"}
                        alt={p.name}
                        className="w-12 h-14 rounded-lg object-cover border border-stone-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 block truncate max-w-xs">{p.name}</span>
                        <span className="font-mono text-[10px] text-stone-400">SKU: {p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 font-medium text-stone-700">{p.category_name}</td>
                  <td className="py-3.5 font-bold text-stone-900 font-sans">
                    {formatPrice(p.selling_price)}{" "}
                    <span className="text-[11px] font-normal text-stone-400 line-through">
                      {formatPrice(p.mrp)}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock_total > 5 ? "bg-emerald-100 text-emerald-800" : p.stock_total > 0 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {p.stock_total} in stock
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${p.slug || p.id}`}
                        target="_blank"
                        className="p-1.5 text-stone-500 hover:text-brand-600 rounded-lg hover:bg-stone-100"
                        title="View on store"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Add New Dress Silhouette</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk Satin Drape Midi Dress"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ALX-DR-009"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL (High-Res) *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fabric</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Occasion</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-stone-700">Luxury Product Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAICopy}
                    disabled={isGeneratingCopy}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-0.5 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-brand-600" />
                    <span>{isGeneratingCopy ? "Generating..." : "Generate with AI"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the silhouette, lining, and craftsmanship details..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              {/* Color & Size Variant Stock Manager */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900">Color & Size Inventory Setup</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">Color Name</label>
                    <input
                      type="text"
                      value={variantColor}
                      onChange={(e) => setVariantColor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Color Hex</label>
                    <input
                      type="text"
                      value={variantColorHex}
                      onChange={(e) => setVariantColorHex(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="block font-semibold text-stone-700">Stock per Size:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {variantSizes.map((vs, idx) => (
                      <div key={vs.size} className="flex items-center gap-1 bg-white p-2 rounded-xl border border-stone-200">
                        <span className="font-bold font-mono w-6">{vs.size}:</span>
                        <input
                          type="number"
                          value={vs.stock}
                          onChange={(e) => {
                            const newArr = [...variantSizes];
                            newArr[idx].stock = Number(e.target.value);
                            setVariantSizes(newArr);
                          }}
                          className="w-full text-xs font-mono font-bold text-stone-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors"
              >
                {isSaving ? "Creating Dress..." : "Publish Dress to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
