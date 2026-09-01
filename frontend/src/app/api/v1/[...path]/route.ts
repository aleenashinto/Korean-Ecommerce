import { NextRequest, NextResponse } from "next/server";

const KOREAN_CATEGORIES = [
  {
    id: 1,
    name: "K-Drama & Romance Dresses",
    slug: "k-drama-dresses",
    description: "Dreamy floral chiffon, tiered fairy midis, and romantic silhouettes.",
    image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: 2,
    name: "Seoul Minimalist & Office Chic",
    slug: "seoul-minimalist",
    description: "Tailored tweed pinafores and structured blazer dresses.",
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: 3,
    name: "Hongdae Street & Y2K Babydolls",
    slug: "hongdae-street",
    description: "Trendy babydoll dresses, ribbon bow slips, and Ulzzang street fits.",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: 4,
    name: "Gangnam Evening & Cocktail Glam",
    slug: "gangnam-glam",
    description: "Midnight velvet gowns, bodycon wraps, and asymmetric satin dresses.",
    image_url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
  {
    id: 5,
    name: "Modern Hanbok & Fusion Couture",
    slug: "modern-hanbok",
    description: "Traditional Jeogori-inspired wrap bodices and flowing organza chima silhouettes.",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    is_active: true,
  },
];

const KOREAN_DRESSES = [
  {
    id: 1,
    name: "Cherry Blossom Floral Chiffon Midi Dress",
    slug: "cherry-blossom-floral-chiffon-midi-dress",
    sku: "KOR-DR-001",
    category_id: 1,
    category_name: "K-Drama & Romance Dresses",
    brand: "Chuu Seoul",
    mrp: 3299,
    selling_price: 1999,
    discount_percent: 39,
    description: "Crafted in airy Korean georgette chiffon with delicate cherry blossom prints, fairy puffed sleeves, and a flattering smocked back waist.",
    fabric: "Korean Chiffon with Soft Rayon Lining",
    pattern: "Cherry Blossom Floral",
    fit: "Fit & Flare with Smocked Waist",
    occasion: "K-Drama Romantic Date & Han River Brunch",
    care_instructions: "Hand wash gently in cold water.",
    is_featured: true,
    is_trending: true,
    is_new_arrival: true,
    is_best_seller: true,
    rating: 4.9,
    review_count: 28,
    primary_image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
    images: [
      { id: 1, image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80", is_primary: true },
      { id: 2, image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80", is_primary: false },
    ],
    variants: [
      { id: 1, color_name: "Sakura Pink", color_code: "#FFB6C1", size: "XS", stock_quantity: 10 },
      { id: 2, color_name: "Sakura Pink", color_code: "#FFB6C1", size: "S", stock_quantity: 18 },
      { id: 3, color_name: "Sakura Pink", color_code: "#FFB6C1", size: "M", stock_quantity: 25 },
      { id: 4, color_name: "Sakura Pink", color_code: "#FFB6C1", size: "L", stock_quantity: 12 },
    ],
  },
  {
    id: 2,
    name: "Seoul Minimalist Tweed Pinafore Dress",
    slug: "seoul-minimalist-tweed-pinafore-dress",
    sku: "KOR-DR-002",
    category_id: 2,
    category_name: "Seoul Minimalist & Office Chic",
    brand: "Stylenanda Korea",
    mrp: 4499,
    selling_price: 2799,
    discount_percent: 38,
    description: "Impeccably tailored in structured Korean bouclé tweed with delicate pearl button accents.",
    fabric: "Korean Bouclé Tweed with Satin Lining",
    pattern: "Houndstooth / Tweed Weave",
    fit: "Structured A-Line Pinafore",
    occasion: "Seoul Office Chic & Gallery Openings",
    care_instructions: "Dry clean recommended.",
    is_featured: true,
    is_trending: true,
    is_new_arrival: true,
    is_best_seller: true,
    rating: 4.8,
    review_count: 34,
    primary_image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    images: [
      { id: 3, image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80", is_primary: true },
    ],
    variants: [
      { id: 5, color_name: "Oatmeal Tweed", color_code: "#E6DFD5", size: "S", stock_quantity: 20 },
      { id: 6, color_name: "Oatmeal Tweed", color_code: "#E6DFD5", size: "M", stock_quantity: 22 },
      { id: 7, color_name: "Oatmeal Tweed", color_code: "#E6DFD5", size: "L", stock_quantity: 14 },
    ],
  },
  {
    id: 3,
    name: "Hongdae Pastel Plaid Babydoll Mini Dress",
    slug: "hongdae-pastel-plaid-babydoll-mini-dress",
    sku: "KOR-DR-003",
    category_id: 3,
    category_name: "Hongdae Street & Y2K Babydolls",
    brand: "Mixxmix Hongdae",
    mrp: 2799,
    selling_price: 1699,
    discount_percent: 39,
    description: "The quintessential Ulzzang look! Features an empire babydoll silhouette and pastel check pattern.",
    fabric: "Breathable Korean Poly-Cotton Twill",
    pattern: "Pastel Gingham Plaid",
    fit: "Relaxed Babydoll / Empire Flare",
    occasion: "Hongdae Street Cafe Hopping",
    care_instructions: "Machine wash cold.",
    is_featured: true,
    is_trending: true,
    is_new_arrival: true,
    is_best_seller: false,
    rating: 4.7,
    review_count: 19,
    primary_image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
    images: [
      { id: 4, image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80", is_primary: true },
    ],
    variants: [
      { id: 8, color_name: "Sky Blue Plaid", color_code: "#87CEEB", size: "S", stock_quantity: 15 },
      { id: 9, color_name: "Sky Blue Plaid", color_code: "#87CEEB", size: "M", stock_quantity: 18 },
    ],
  },
  {
    id: 4,
    name: "Gangnam Midnight Velvet Draped Gown",
    slug: "gangnam-midnight-velvet-draped-gown",
    sku: "KOR-DR-004",
    category_id: 4,
    category_name: "Gangnam Evening & Cocktail Glam",
    brand: "DABAGIRL Seoul",
    mrp: 5499,
    selling_price: 3299,
    discount_percent: 40,
    description: "Sumptuous stretch Korean micro-velvet contours the body with a side ruched drape and an alluring high slit.",
    fabric: "Korean Stretch Micro-Velvet",
    pattern: "Lustrous Solid Velvet",
    fit: "Bodycon Ruched Wrap with Thigh Slit",
    occasion: "Cocktail Gala, Red Carpet & K-Pop Stage",
    care_instructions: "Dry clean only.",
    is_featured: true,
    is_trending: true,
    is_new_arrival: false,
    is_best_seller: true,
    rating: 5.0,
    review_count: 42,
    primary_image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80",
    images: [
      { id: 5, image_url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80", is_primary: true },
    ],
    variants: [
      { id: 10, color_name: "Midnight Emerald", color_code: "#046307", size: "S", stock_quantity: 14 },
      { id: 11, color_name: "Midnight Emerald", color_code: "#046307", size: "M", stock_quantity: 18 },
    ],
  },
  {
    id: 5,
    name: "Modern Hanbok Organza Wrap Midi Dress",
    slug: "modern-hanbok-organza-wrap-midi-dress",
    sku: "KOR-DR-005",
    category_id: 5,
    category_name: "Modern Hanbok & Fusion Couture",
    brand: "Yeon Hanok Atelier",
    mrp: 6299,
    selling_price: 3999,
    discount_percent: 36,
    description: "Traditional Jeogori crossover neckline with hand-tied goreum ribbons and a sweeping pleated organza chima skirt.",
    fabric: "Natural Korean Organza Silk Blend",
    pattern: "Hand-embroidered Floral Motifs",
    fit: "Crossover Wrap A-Line",
    occasion: "Festive Celebrations, Weddings & High Tea",
    care_instructions: "Specialist silk dry clean only.",
    is_featured: true,
    is_trending: true,
    is_new_arrival: true,
    is_best_seller: true,
    rating: 4.9,
    review_count: 22,
    primary_image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    images: [
      { id: 6, image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80", is_primary: true },
    ],
    variants: [
      { id: 12, color_name: "Cloud White & Rose", color_code: "#FFF5EE", size: "S", stock_quantity: 12 },
      { id: 13, color_name: "Cloud White & Rose", color_code: "#FFF5EE", size: "M", stock_quantity: 15 },
    ],
  },
];

const BANNERS = [
  {
    id: 1,
    title: "Seoul Fashion Week 2026",
    subtitle: "Curated runway dresses straight from Dongdaemun & Gangnam fashion ateliers.",
    image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1600&q=80",
    tag: "NEW SEASON DROP",
    button_text: "Explore K-Dresses",
    button_link: "/shop",
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    title: "K-Drama Romance Edit",
    subtitle: "Pastel floral chiffon, fairy puffed sleeves, and effortless Parisian-Seoul charm.",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    tag: "TRENDING VIRAL",
    button_text: "Shop Romance",
    button_link: "/shop?category=k-drama-dresses",
    display_order: 2,
    is_active: true,
  },
];

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathStr = (params.path || []).join("/");

  if (pathStr === "categories") {
    return NextResponse.json(KOREAN_CATEGORIES);
  }

  if (pathStr === "banners") {
    return NextResponse.json(BANNERS);
  }

  if (pathStr === "products") {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("category");
    const isTrending = searchParams.get("is_trending");
    const isNew = searchParams.get("is_new_arrival");
    const isBest = searchParams.get("is_best_seller");
    const query = searchParams.get("q")?.toLowerCase();

    let items = [...KOREAN_DRESSES];
    if (cat) {
      items = items.filter((p) => p.category_name.toLowerCase().includes(cat.toLowerCase()));
    }
    if (query) {
      items = items.filter((p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }
    if (isTrending === "true") items = items.filter((p) => p.is_trending);
    if (isNew === "true") items = items.filter((p) => p.is_new_arrival);
    if (isBest === "true") items = items.filter((p) => p.is_best_seller);

    return NextResponse.json({
      items,
      total: items.length,
      page: 1,
      limit: 20,
      total_pages: 1,
    });
  }

  if (pathStr.startsWith("products/")) {
    const idOrSlug = pathStr.replace("products/", "");
    const prod = KOREAN_DRESSES.find((p) => String(p.id) === idOrSlug || p.slug === idOrSlug) || KOREAN_DRESSES[0];
    return NextResponse.json(prod);
  }

  if (pathStr.startsWith("reviews/product/")) {
    return NextResponse.json([
      {
        id: 1,
        user_name: "Ananya S.",
        rating: 5,
        review_title: "Stunning K-Drama Aesthetic!",
        comment: "The fabric is so soft, breathable and looks exactly like the photos. Highly recommended!",
        created_at: new Date().toISOString(),
      }
    ]);
  }

  if (pathStr.startsWith("ai/complete-the-look/")) {
    return NextResponse.json({
      base_product: KOREAN_DRESSES[0],
      paired_accessories: [
        {
          id: 901,
          name: "Freshwater Pearl Hair Clip Set",
          price: 699,
          image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
          styling_tip: "Seoul half-up hairstyle accent."
        },
        {
          id: 902,
          name: "Quilted Cloud Dumpling Bag",
          price: 1499,
          image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
          styling_tip: "Trending Gangnam street style."
        }
      ],
      bundle_original_price: 4197,
      bundle_special_price: 3567,
      bundle_savings: 630,
      stylist_curation_note: "Minji paired this dress with pearl clips and a cloud dumpling bag."
    });
  }

  return NextResponse.json({ status: "ok", path: pathStr });
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathStr = (params.path || []).join("/");
  const body = await req.json().catch(() => ({}));

  if (pathStr === "auth/login") {
    const email = body.email || "user@auraluxe.com";
    const isAdmin = email.includes("admin");
    return NextResponse.json({
      access_token: "mock-jwt-token-auraluxe-seoul-auth",
      token_type: "bearer",
      user: {
        id: isAdmin ? 1 : 2,
        email,
        first_name: isAdmin ? "Ji-eun (Admin)" : "Ananya",
        last_name: isAdmin ? "Park" : "Sharma",
        role: isAdmin ? "ADMIN" : "USER",
        phone: "+82 10-1234-5678",
      },
    });
  }

  if (pathStr === "ai/chat") {
    return NextResponse.json({
      reply: "✨ **Annyeonghaseyo! I'm Minji (민지), your Seoul AI Virtual Stylist.**\n\nI have handpicked our trending K-Drama and Gangnam collection dresses for you!",
      suggested_prompts: [
        "K-Drama floral chiffon midi dresses",
        "Seoul minimalist tweed office dress under ₹3000",
        "Modern Hanbok fusion wrap dresses",
      ],
      recommended_products: KOREAN_DRESSES.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.selling_price,
        mrp: p.mrp,
        discount_percent: p.discount_percent,
        image_url: p.primary_image,
        category: p.category_name,
        rating: p.rating,
        reason: "Curated Seoul K-fashion silhouette.",
      })),
      action_type: "product_recommendation",
    });
  }

  if (pathStr === "ai/size-recommend") {
    return NextResponse.json({
      recommended_size: "M",
      korean_standard_size: "Korean 66 (M)",
      confidence_score: 96,
      fit_analysis: "Based on your measurements and Korean sizing standards, Size M (Korean 66) provides the authentic Ulzzang silhouette with effortless drape.",
      alternate_size: "L",
      measurement_comparison: {
        user_bust: "34\"",
        user_waist: "28\"",
        user_hips: "38\"",
        korean_grade: "Korean 66 (M)",
        stretch_note: "Korean high-twist crepe with relaxed ease"
      }
    });
  }

  return NextResponse.json({ status: "ok" });
}
