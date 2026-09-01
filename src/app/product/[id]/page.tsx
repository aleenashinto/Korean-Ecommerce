"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles,
  Info,
  X,
  MessageSquarePlus
} from "lucide-react";
import { api } from "@/lib/api";
import { ProductDetail, Review, ProductCard as ProductCardType } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/product/ProductCard";
import { AISizeRecommender } from "@/components/ai/AISizeRecommender";
import { CompleteTheLook } from "@/components/ai/CompleteTheLook";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardType[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Modals & Accordions
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>("details");
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewTitleInput, setReviewTitleInput] = useState("");
  const [reviewCommentInput, setReviewCommentInput] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setIsLoading(true);
      try {
        const prodData: ProductDetail = await api.getProduct(idOrSlug);
        setProduct(prodData);

        // Set default color and size from first variant
        if (prodData.variants && prodData.variants.length > 0) {
          setSelectedColor(prodData.variants[0].color_name);
          setSelectedSize(prodData.variants[0].size);
        }

        // Fetch reviews and related products
        const [revs, related] = await Promise.all([
          api.getProductReviews(prodData.id),
          api.getProducts({ category_id: prodData.category_id, limit: 4 }),
        ]);
        setReviews(revs);
        setRelatedProducts(related.items?.filter((p: any) => p.id !== prodData.id) || []);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (idOrSlug) loadProductData();
  }, [idOrSlug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-stone-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-stone-200 rounded-lg w-3/4" />
            <div className="h-6 bg-stone-200 rounded-lg w-1/4" />
            <div className="h-24 bg-stone-200 rounded-lg" />
            <div className="h-12 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto my-24 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Dress Not Found</h2>
        <p className="text-xs text-stone-500">The product you are looking for may have been moved or is currently unavailable.</p>
        <Link href="/shop" className="inline-block bg-brand-600 text-white text-xs font-semibold px-6 py-2.5 rounded-full">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Find unique colors
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color_name)));
  
  // Find available sizes for selected color
  const colorVariants = product.variants.filter((v) => v.color_name === selectedColor);
  const availableSizesForColor = colorVariants.map((v) => v.size);

  // Selected variant
  const selectedVariant = product.variants.find(
    (v) => v.color_name === selectedColor && v.size === selectedSize
  );
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a valid size and color combination.");
      return;
    }
    if (isOutOfStock) {
      alert("This variant is currently out of stock.");
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, selectedVariant.id, quantity);
      alert(`✨ Added ${quantity} item(s) of "${product.name}" to your shopping bag!`);
    } catch (err: any) {
      alert(err.message || "Please log in to add items to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsBuyingNow(true);
    try {
      await addToCart(product.id, selectedVariant.id, quantity);
      router.push("/cart");
    } catch (err: any) {
      alert(err.message || "Please log in to proceed to checkout.");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setDeliveryMessage(`✓ Delivery available at ${pincode}! Expected by 3–5 business days.`);
    } else {
      setDeliveryMessage("Please enter a valid 6-digit PIN code.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to post your review.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await api.submitReview({
        product_id: product.id,
        rating: ratingInput,
        title: reviewTitleInput.trim() || undefined,
        comment: reviewCommentInput.trim(),
      });
      alert("🎉 Thank you! Your review has been submitted successfully.");
      setIsReviewModalOpen(false);
      // Reload reviews and product
      const [updatedRevs, updatedProd] = await Promise.all([
        api.getProductReviews(product.id),
        api.getProduct(product.id.toString())
      ]);
      setReviews(updatedRevs);
      setProduct(updatedProd);
      setReviewCommentInput("");
      setReviewTitleInput("");
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isLiked = isInWishlist(product.id);
  const images = product.images.length > 0
    ? product.images
    : [{ id: 0, product_id: product.id, image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80", is_primary: true, display_order: 0 }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-stone-800">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-stone-800">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category_name?.toLowerCase().replace(' ', '-')}`} className="hover:text-stone-800">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Image Gallery (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] sm:w-20 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] w-16 sm:w-full rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-brand-600 ring-2 ring-brand-200"
                      : "border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Display Image */}
          <div className="relative flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-md group">
            <img
              src={images[selectedImageIndex]?.image_url || images[0].image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Form (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Brand & Category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
                {product.brand} • {product.category_name}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border transition-colors ${
                  isLiked ? "bg-rose-50 border-rose-200 text-rose-600" : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-600" : ""}`} />
              </button>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-stone-400 font-mono">SKU: {product.sku}</p>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-stone-900 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <a href="#reviews" className="text-xs font-medium text-stone-500 hover:text-brand-600 underline">
              {product.review_count} Verified Customer Reviews
            </a>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-stone-950 font-sans">
                {formatPrice(product.selling_price)}
              </span>
              {product.mrp > product.selling_price && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Save {formatPrice(product.mrp - product.selling_price)} ({product.discount_percent}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-stone-500">Inclusive of all taxes. Free shipping on orders &gt; ₹999.</p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">
                Color: <span className="font-normal text-stone-600">{selectedColor}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((cName) => {
                const variant = product.variants.find((v) => v.color_name === cName);
                const isSelected = selectedColor === cName;
                return (
                  <button
                    key={cName}
                    onClick={() => {
                      setSelectedColor(cName);
                      // Adjust selected size if current size isn't available in new color
                      const validSizes = product.variants.filter((v) => v.color_name === cName).map((v) => v.size);
                      if (!validSizes.includes(selectedSize) && validSizes.length > 0) {
                        setSelectedSize(validSizes[0]);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 text-stone-700"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 flex-shrink-0"
                      style={{ backgroundColor: variant?.color_code || "#000" }}
                    />
                    <span>{cName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">
                Select Size: <span className="font-normal text-stone-600">{selectedSize}</span>
              </span>
              <div className="flex items-center gap-3">
                <AISizeRecommender
                  productId={product.id}
                  onSizeSelected={(sz) => setSelectedSize(sz)}
                />
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL", "FREE SIZE"].map((sz) => {
                const isAvailable = availableSizesForColor.includes(sz);
                if (!isAvailable) return null;
                const vObj = colorVariants.find((v) => v.size === sz);
                const isSelected = selectedSize === sz;
                const stock = vObj?.stock_quantity || 0;

                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] h-11 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 shadow-md"
                        : stock > 0
                        ? "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
                        : "bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed"
                    }`}
                  >
                    <span>{sz}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Stock Status indicator */}
            <div className="text-xs pt-1">
              {currentStock > 5 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> In Stock ({currentStock} available)
                </span>
              ) : currentStock > 0 ? (
                <span className="text-amber-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Only {currentStock} left in stock — order soon!
                </span>
              ) : (
                <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Sold out in this combination
                </span>
              )}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 px-2 py-1">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 text-sm font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(currentStock || 5, prev + 1))}
                  className="w-7 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className="flex-1 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || isBuyingNow}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-stone-300 text-white py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <Zap className="w-4 h-4 text-champagne-300 fill-champagne-300" />
              <span>{isBuyingNow ? "Processing..." : "Buy Now"}</span>
            </button>
          </div>

          {/* PIN code Checker */}
          <div className="pt-3 border-t border-stone-200">
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Delivery Pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Check
              </button>
            </form>
            {deliveryMessage && (
              <p className="text-[11px] font-medium text-brand-700 mt-2">{deliveryMessage}</p>
            )}
          </div>

          {/* Product Specifications & Accordions */}
          <div className="border-t border-stone-200 pt-4 space-y-2">
            {/* Description & Fit */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "details" ? "" : "details")}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-stone-900 text-left"
              >
                <span>Product Description & Fabric Specs</span>
                {activeAccordion === "details" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === "details" && (
                <div className="px-4 pb-4 text-xs text-stone-600 space-y-3 border-t border-stone-50 pt-3">
                  <p className="leading-relaxed">{product.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-400">Fabric:</span> <strong className="text-stone-800">{product.fabric || "Premium Poly-Blend"}</strong></div>
                    <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-400">Pattern:</span> <strong className="text-stone-800">{product.pattern || "Solid"}</strong></div>
                    <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-400">Fit:</span> <strong className="text-stone-800">{product.fit || "Standard"}</strong></div>
                    <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-400">Occasion:</span> <strong className="text-stone-800">{product.occasion || "Versatile"}</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "care" ? "" : "care")}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-stone-900 text-left"
              >
                <span>Care & Maintenance Instructions</span>
                {activeAccordion === "care" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === "care" && (
                <div className="px-4 pb-4 text-xs text-stone-600 border-t border-stone-50 pt-3 leading-relaxed">
                  {product.care_instructions || "Hand wash in cold water or dry clean. Do not bleach. Iron on reverse."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Complete The Look Outfit & Accessory Bundle */}
      <CompleteTheLook productId={product.id} currentVariantId={selectedVariant?.id} />

      {/* Verified Customer Reviews Section with AI Sentiment Analysis */}
      <section id="reviews" className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Client Feedback & AI Insights</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
              Customer Reviews ({reviews.length})
            </h2>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* AI Review Summary Box */}
        <div className="bg-gradient-to-r from-amber-50/70 via-stone-50 to-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-xs text-stone-900">AI Customer Sentiment Summary</h3>
            </div>
            <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              96% Positive Sentiment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1">✓ Top Praises:</span>
              <ul className="text-stone-600 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Breathable fabric with elegant couture drape and movement</li>
                <li>True-to-photo rich color fidelity and premium lining</li>
              </ul>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-stone-700 flex items-center gap-1">ℹ Sizing & Care Tips:</span>
              <ul className="text-stone-600 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Dry cleaning recommended to preserve fabric luster</li>
                <li>Best paired with 2-3 inch heels for heights under 5'3"</li>
              </ul>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No reviews yet for this dress. Be the first verified buyer to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-stone-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{formatDate(rev.created_at)}</span>
                </div>
                {rev.title && <h4 className="font-semibold text-xs text-stone-900">{rev.title}</h4>}
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200/60">
                  <span className="font-semibold text-stone-800">{rev.user_name}</span>
                  {rev.is_verified_purchase && (
                    <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-brand-600">Styled Together</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                You May Also Admire
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal Popup */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-brand-600" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Standard Size Guide (Inches)</h3>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-700">
                  <th className="p-2.5 font-bold">Size</th>
                  <th className="p-2.5 font-bold">Bust</th>
                  <th className="p-2.5 font-bold">Waist</th>
                  <th className="p-2.5 font-bold">Hip</th>
                  <th className="p-2.5 font-bold">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                <tr><td className="p-2.5 font-bold font-sans">XS</td><td className="p-2.5">32"</td><td className="p-2.5">26"</td><td className="p-2.5">35"</td><td className="p-2.5">48"</td></tr>
                <tr><td className="p-2.5 font-bold font-sans">S</td><td className="p-2.5">34"</td><td className="p-2.5">28"</td><td className="p-2.5">37"</td><td className="p-2.5">49"</td></tr>
                <tr><td className="p-2.5 font-bold font-sans">M</td><td className="p-2.5">36"</td><td className="p-2.5">30"</td><td className="p-2.5">39"</td><td className="p-2.5">50"</td></tr>
                <tr><td className="p-2.5 font-bold font-sans">L</td><td className="p-2.5">38"</td><td className="p-2.5">32"</td><td className="p-2.5">41"</td><td className="p-2.5">51"</td></tr>
                <tr><td className="p-2.5 font-bold font-sans">XL</td><td className="p-2.5">40"</td><td className="p-2.5">34"</td><td className="p-2.5">43"</td><td className="p-2.5">52"</td></tr>
                <tr><td className="p-2.5 font-bold font-sans">XXL</td><td className="p-2.5">42"</td><td className="p-2.5">36"</td><td className="p-2.5">45"</td><td className="p-2.5">52"</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-stone-400 italic">
              Tip: If you fall between sizes, we recommend choosing the larger size for a relaxed luxury silhouette.
            </p>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full bg-stone-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-stone-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Share Your Experience</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 text-amber-500 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= ratingInput ? "fill-amber-500" : "text-stone-300"}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">{ratingInput} of 5 Stars</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Flawless stitch and fabric quality!"
                  value={reviewTitleInput}
                  onChange={(e) => setReviewTitleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Detailed Feedback *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the drape, comfort, sizing, and compliments you received..."
                  value={reviewCommentInput}
                  onChange={(e) => setReviewCommentInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-md"
              >
                {isSubmittingReview ? "Submitting..." : "Publish Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
