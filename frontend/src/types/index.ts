export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role_id: number;
  role_name: "USER" | "ADMIN";
  is_active: boolean;
  created_at: string;
  addresses: Address[];
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  street_address: string;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color_name: string;
  color_code?: string | null;
  size: string;
  stock_quantity: number;
  sku?: string | null;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface ProductCard {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category_name?: string | null;
  brand: string;
  mrp: number;
  selling_price: number;
  discount_percent: number;
  rating: number;
  review_count: number;
  primary_image?: string | null;
  hover_image?: string | null;
  available_colors: string[];
  available_sizes: string[];
  is_new_arrival: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  in_stock: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category_id: number;
  category_name?: string | null;
  subcategory_id?: number | null;
  subcategory_name?: string | null;
  brand: string;
  mrp: number;
  selling_price: number;
  discount_percent: number;
  description?: string | null;
  fabric?: string | null;
  pattern?: string | null;
  fit?: string | null;
  occasion?: string | null;
  care_instructions?: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_published: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  subcategories: Subcategory[];
  product_count: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  product_slug: string;
  color_name: string;
  size: string;
  price: number;
  mrp: number;
  quantity: number;
  total_price: number;
  image_url?: string | null;
  stock_available: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax_amount: number;
  total: number;
  applied_coupon?: string | null;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  created_at: string;
  product: ProductCard;
}

export interface Coupon {
  id: number;
  code: string;
  description?: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  expiry_date?: string | null;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
}

export interface OrderItem {
  id: number;
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  color?: string | null;
  size?: string | null;
  price: number;
  quantity: number;
  total_price: number;
  image_url?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string | null;
  payment_method: string;
  payment_status: string;
  order_status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  tracking_number?: string | null;
  estimated_delivery: string;
  created_at: string;
  items: OrderItem[];
}

export interface ReturnRequest {
  id: number;
  order_id: number;
  order_number?: string | null;
  order_item_id?: number | null;
  user_id: number;
  customer_name?: string | null;
  customer_email?: string | null;
  reason: string;
  details?: string | null;
  status: "Pending" | "Approved" | "Rejected" | "Refunded";
  admin_notes?: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  product_name?: string | null;
  user_id: number;
  user_name: string;
  rating: number;
  title?: string | null;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string | null;
  tag?: string | null;
  image_url: string;
  button_text: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
}

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  pending_orders_count: number;
  pending_returns_count: number;
  recent_orders: Order[];
  daily_sales: { date: string; revenue: number; orders: number }[];
  top_selling_products: { name: string; sold: number; revenue: number }[];
}
