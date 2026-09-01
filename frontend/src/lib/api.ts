const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auraluxe_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `Request failed with status ${response.status}`;
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

// ---------------- API SERVICES ----------------
export const api = {
  // Auth
  register: (data: any) => fetchApi<any>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => fetchApi<any>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => fetchApi<any>("/auth/me"),
  updateProfile: (data: any) => fetchApi<any>("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  getAddresses: () => fetchApi<any[]>("/auth/addresses"),
  createAddress: (data: any) => fetchApi<any>("/auth/addresses", { method: "POST", body: JSON.stringify(data) }),
  deleteAddress: (id: number) => fetchApi<any>(`/auth/addresses/${id}`, { method: "DELETE" }),

  // Products
  getProducts: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          query.append(k, String(v));
        }
      });
    }
    const qStr = query.toString() ? `?${query.toString()}` : "";
    return fetchApi<any>(`/products${qStr}`);
  },
  getProduct: (idOrSlug: string) => fetchApi<any>(`/products/${idOrSlug}`),

  // Categories
  getCategories: () => fetchApi<any[]>("/categories"),

  // Cart
  getCart: () => fetchApi<any>("/cart"),
  addToCart: (productId: number, variantId: number, quantity: number = 1) =>
    fetchApi<any>("/cart/items", { method: "POST", body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity }) }),
  updateCartItem: (itemId: number, quantity: number) =>
    fetchApi<any>(`/cart/items/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId: number) => fetchApi<any>(`/cart/items/${itemId}`, { method: "DELETE" }),
  moveCartItemToWishlist: (itemId: number) => fetchApi<any>(`/cart/items/${itemId}/move-to-wishlist`, { method: "POST" }),
  clearCart: () => fetchApi<any>("/cart", { method: "DELETE" }),

  // Wishlist
  getWishlist: () => fetchApi<any[]>("/wishlist"),
  toggleWishlist: (productId: number) =>
    fetchApi<any>("/wishlist/items", { method: "POST", body: JSON.stringify({ product_id: productId }) }),
  removeFromWishlist: (productId: number) => fetchApi<any>(`/wishlist/items/${productId}`, { method: "DELETE" }),

  // Coupons
  getCoupons: () => fetchApi<any[]>("/coupons"),
  validateCoupon: (code: string, cartTotal: number) =>
    fetchApi<any>("/coupons/validate", { method: "POST", body: JSON.stringify({ code, cart_total: cartTotal }) }),

  // Orders
  createOrder: (orderData: any) => fetchApi<any>("/orders", { method: "POST", body: JSON.stringify(orderData) }),
  getMyOrders: () => fetchApi<any[]>("/orders"),
  getOrderDetail: (idOrNumber: string) => fetchApi<any>(`/orders/${idOrNumber}`),

  // Returns
  submitReturn: (data: any) => fetchApi<any>("/returns", { method: "POST", body: JSON.stringify(data) }),
  getMyReturns: () => fetchApi<any[]>("/returns"),

  // Reviews
  getProductReviews: (productId: number) => fetchApi<any[]>(`/reviews/product/${productId}`),
  submitReview: (data: any) => fetchApi<any>("/reviews", { method: "POST", body: JSON.stringify(data) }),

  // Banners
  getBanners: () => fetchApi<any[]>("/banners"),

  // Admin APIs
  admin: {
    getStats: () => fetchApi<any>("/admin/stats"),
    getProducts: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params as any).toString();
      return fetchApi<any>(`/admin/products${q ? `?${q}` : ""}`);
    },
    createProduct: (data: any) => fetchApi<any>("/admin/products", { method: "POST", body: JSON.stringify(data) }),
    updateProduct: (id: number, data: any) => fetchApi<any>(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteProduct: (id: number) => fetchApi<any>(`/admin/products/${id}`, { method: "DELETE" }),

    getOrders: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params as any).toString();
      return fetchApi<any>(`/admin/orders${q ? `?${q}` : ""}`);
    },
    updateOrderStatus: (orderId: number, data: any) =>
      fetchApi<any>(`/admin/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify(data) }),

    getCustomers: () => fetchApi<any[]>("/admin/customers"),
    toggleCustomerStatus: (userId: number) => fetchApi<any>(`/admin/customers/${userId}/toggle-status`, { method: "PUT" }),

    getInventory: () => fetchApi<any[]>("/admin/inventory"),
    updateStock: (variantId: number, stock: number) =>
      fetchApi<any>(`/admin/inventory/${variantId}?stock=${stock}`, { method: "PUT" }),

    getCoupons: () => fetchApi<any[]>("/admin/coupons"),
    createCoupon: (data: any) => fetchApi<any>("/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
    deleteCoupon: (id: number) => fetchApi<any>(`/admin/coupons/${id}`, { method: "DELETE" }),

    getBanners: () => fetchApi<any[]>("/admin/banners"),
    createBanner: (data: any) => fetchApi<any>("/admin/banners", { method: "POST", body: JSON.stringify(data) }),
    deleteBanner: (id: number) => fetchApi<any>(`/admin/banners/${id}`, { method: "DELETE" }),

    getReturns: () => fetchApi<any[]>("/admin/returns"),
    updateReturnStatus: (returnId: number, data: any) =>
      fetchApi<any>(`/admin/returns/${returnId}/status`, { method: "PUT", body: JSON.stringify(data) }),

    getReviews: () => fetchApi<any[]>("/admin/reviews"),
    deleteReview: (id: number) => fetchApi<any>(`/admin/reviews/${id}`, { method: "DELETE" }),

    createCategory: (data: any) => fetchApi<any>("/admin/categories", { method: "POST", body: JSON.stringify(data) }),
    deleteCategory: (id: number) => fetchApi<any>(`/admin/categories/${id}`, { method: "DELETE" }),
  },

  // AI Services Layer
  ai: {
    chat: (messages: { role: string; content: string }[], userContext?: any) =>
      fetchApi<any>("/ai/chat", { method: "POST", body: JSON.stringify({ messages, user_context: userContext }) }),
    visualSearch: (data: { image_url?: string; image_tags?: string[]; color_hint?: string; style_category?: string }) =>
      fetchApi<any>("/ai/visual-search", { method: "POST", body: JSON.stringify(data) }),
    sizeRecommend: (data: { product_id: number; height_cm?: number; weight_kg?: number; bust_inches: number; waist_inches: number; hip_inches: number; fit_preference?: string }) =>
      fetchApi<any>("/ai/size-recommend", { method: "POST", body: JSON.stringify(data) }),
    getReviewSummary: (productId: number) =>
      fetchApi<any>(`/ai/review-summary/${productId}`),
    getCompleteTheLook: (productId: number) =>
      fetchApi<any>(`/ai/complete-the-look/${productId}`),
    generateCopy: (data: { product_name: string; fabric?: string; occasion?: string; fit?: string; key_highlights?: string }) =>
      fetchApi<any>("/ai/generate-copy", { method: "POST", body: JSON.stringify(data) }),
    getFraudRisk: (orderId: number) =>
      fetchApi<any>(`/ai/fraud-risk/${orderId}`),
  },
};
