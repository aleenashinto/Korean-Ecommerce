"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  Eye,
  Check,
  Tag,
  Boxes,
  HelpCircle,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Search,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function AdminAddProductStudioPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // Section 1: Basic Info
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [brand, setBrand] = useState("AuraLuxe");

  // Section 2: Pricing
  const [mrp, setMrp] = useState<number>(3499);
  const [sellingPrice, setSellingPrice] = useState<number>(2199);

  // Section 3: Garment Attributes
  const [fabric, setFabric] = useState("Pure Mulberry Silk Satin");
  const [pattern, setPattern] = useState("Solid Lustrous");
  const [fit, setFit] = useState("Fit & Flare / Empire Waist");
  const [occasion, setOccasion] = useState("Cocktail & Evening Gala");
  const [careInstructions, setCareInstructions] = useState("Dry clean only. Steam iron on reverse at low temperature.");

  // Section 4: Visuals & Images
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Section 5: Variants Matrix (Color + Sizes with Stock)
  const [colorName, setColorName] = useState("Midnight Emerald");
  const [colorHex, setColorHex] = useState("#046307");
  const [sizeStock, setSizeStock] = useState([
    { size: "XS", stock: 8, lowThreshold: 2 },
    { size: "S", stock: 15, lowThreshold: 3 },
    { size: "M", stock: 20, lowThreshold: 4 },
    { size: "L", stock: 12, lowThreshold: 3 },
    { size: "XL", stock: 6, lowThreshold: 2 },
    { size: "XXL", stock: 4, lowThreshold: 2 },
  ]);

  // Section 6: SEO & Visibility
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [isTrending, setIsTrending] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  // State
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  useEffect(() => {
    api.getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .finally(() => setIsLoadingCats(false));
  }, []);

  // Auto-generate slug when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSlug(autoSlug);
    setMetaTitle(`${val} | Designer Women's Fashion | AuraLuxe`);
  };

  // AI Copywriter
  const handleGenerateAICopy = async () => {
    if (!name.trim()) {
      alert("Please enter a product title first.");
      return;
    }
    setIsGeneratingCopy(true);
    try {
      const copy = await api.ai.generateCopy({
        product_name: name,
        fabric,
        occasion,
        fit,
      });
      setDescription(copy.luxury_description);
      setShortDesc(`Exquisite ${fabric} silhouette crafted for ${occasion}. Features a refined ${fit} fit.`);
      setMetaTitle(copy.seo_title);
      setMetaDescription(copy.seo_meta_description);
      alert("✨ AI successfully generated luxury copy, bullet attributes, and SEO metadata!");
    } catch (err: any) {
      alert(err.message || "Failed to generate AI copy");
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      alert("Please provide both Product Title and SKU.");
      return;
    }
    if (images.length === 0) {
      alert("Please provide at least one product image.");
      return;
    }

    setIsSaving(true);
    try {
      const variantsPayload = sizeStock.map((s) => ({
        color_name: colorName,
        color_code: colorHex,
        size: s.size,
        stock_quantity: s.stock,
      }));

      const imagesPayload = images.map((url, idx) => ({
        image_url: url,
        is_primary: idx === 0,
        display_order: idx,
      }));

      const created = await api.admin.createProduct({
        name,
        slug: slug.trim() || undefined,
        sku: sku.trim().toUpperCase(),
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
        is_featured: isFeatured,
        is_trending: isTrending,
        is_published: isPublished,
        images: imagesPayload,
        variants: variantsPayload,
      });

      alert("🎉 Product published to catalog and indexed for AI search successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const discountPercent = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100));

  return (
    <form onSubmit={handleSaveProduct} className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-stone-500 hover:text-stone-900 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-600 font-mono">
                Catalog Studio
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                New Silhouette
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              Create New Dress
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (slug) window.open(`/shop?q=${encodeURIComponent(name)}`, "_blank");
              else alert("Enter a title first to preview.");
            }}
            className="bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-300 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>Preview in Storefront</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-stone-400 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? "Publishing..." : "Publish to Storefront"}</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: Basic Info, Gallery, Variants */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-base font-bold text-stone-900">
                1. Basic Information & AI Copywriting
              </h2>
              <button
                type="button"
                onClick={handleGenerateAICopy}
                disabled={isGeneratingCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>{isGeneratingCopy ? "Drafting..." : "AI Generate Description"}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Emerald Satin Drape Evening Gown"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU Identification Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ALX-DR-010"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-brand-500 focus:bg-white focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description (Cards & Snippets)</label>
                <input
                  type="text"
                  placeholder="e.g. Fluid silhouette with a structured sweetheart bodice and subtle sheen."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Luxury Description (Markdown Supported)</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the fabric weight, lining, silhouette movement, and celebratory occasions..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed focus:ring-1 focus:ring-brand-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: High-Resolution Visual Gallery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-base font-bold text-stone-900">
                2. Visual Gallery & Lookbook Imagery ({images.length})
              </h2>
              <span className="text-[11px] text-stone-400 font-mono">Drag or add direct URLs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((url, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm bg-stone-100"
                >
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-stone-900 text-champagne-300 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono shadow-md">
                      PRIMARY COVER
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="url"
                placeholder="Paste high-res image URL (e.g. Unsplash or Cloudinary)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-stone-900 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                + Add Image
              </button>
            </div>
          </div>

          {/* Section 3: Color & Size Variant Matrix with Stock Quantities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-base font-bold text-stone-900">
                3. Color & Size Inventory Matrix
              </h2>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                Total Units: {sizeStock.reduce((acc, curr) => acc + curr.stock, 0)}
              </span>
            </div>

            {/* Color Swatch Setup */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Color Name</label>
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="e.g. Midnight Emerald"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Color Swatch Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-stone-200 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Per-Size Stock Table */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-stone-700">Stock per Size Variant:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sizeStock.map((item, idx) => (
                  <div key={item.size} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 font-mono">{item.size}</span>
                      <span className="text-[10px] text-stone-400">Min Alert: {item.lowThreshold}</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={item.stock}
                      onChange={(e) => {
                        const newArr = [...sizeStock];
                        newArr[idx].stock = Math.max(0, Number(e.target.value));
                        setSizeStock(newArr);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Pricing, Category, Attributes, Visibility */}
        <div className="lg:col-span-4 space-y-8">
          {/* Section 4: Pricing & Margin */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Pricing & Discounts
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Base Price / MRP (₹) *</label>
                <input
                  type="number"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Selling / Offer Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold text-brand-700"
                />
              </div>

              {/* Live Discount Pill */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Calculated Discount:</span>
                <span className="font-bold text-emerald-800 font-mono">
                  {discountPercent}% OFF (Save {formatPrice(mrp - sellingPrice)})
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Taxonomy & Garment Attributes */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Garment Attributes
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Fabric / Material</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Silhouette Fit</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Occasion Tag</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 6: SEO & Visibility Toggles */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              SEO & Visibility
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-semibold text-stone-800">Feature on Homepage Carousel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-semibold text-stone-800">Tag as "Trending Silhouette"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-semibold text-stone-800">Publish to Live Customer Catalog</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
