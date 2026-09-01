from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# ----------------- AUTH & USER SCHEMAS -----------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class AddressBase(BaseModel):
    full_name: str
    phone: str
    street_address: str
    landmark: Optional[str] = None
    city: str
    state: str
    postal_code: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    role_id: int
    role_name: Optional[str] = "USER"
    is_active: bool
    created_at: datetime
    addresses: List[AddressResponse] = []

    class Config:
        from_attributes = True

# ----------------- CATEGORY SCHEMAS -----------------
class SubcategoryBase(BaseModel):
    name: str
    slug: str
    is_active: bool = True

class SubcategoryCreate(SubcategoryBase):
    category_id: int

class SubcategoryResponse(SubcategoryBase):
    id: int
    category_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    subcategories: List[SubcategoryResponse] = []
    product_count: Optional[int] = 0

    class Config:
        from_attributes = True

# ----------------- PRODUCT & VARIANT SCHEMAS -----------------
class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False
    display_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

class ProductVariantBase(BaseModel):
    color_name: str
    color_code: Optional[str] = None
    size: str
    stock_quantity: int = 0
    sku: Optional[str] = None

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: Optional[str] = None
    sku: str
    category_id: int
    subcategory_id: Optional[int] = None
    brand: str = "AuraLuxe"
    mrp: float
    selling_price: float
    discount_percent: Optional[int] = 0
    description: Optional[str] = None
    fabric: Optional[str] = None
    pattern: Optional[str] = None
    fit: Optional[str] = None
    occasion: Optional[str] = None
    care_instructions: Optional[str] = None
    is_featured: bool = False
    is_trending: bool = False
    is_new_arrival: bool = False
    is_best_seller: bool = False
    is_published: bool = True

class ProductCreate(ProductBase):
    images: List[ProductImageCreate] = []
    variants: List[ProductVariantCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    brand: Optional[str] = None
    mrp: Optional[float] = None
    selling_price: Optional[float] = None
    discount_percent: Optional[int] = None
    description: Optional[str] = None
    fabric: Optional[str] = None
    pattern: Optional[str] = None
    fit: Optional[str] = None
    occasion: Optional[str] = None
    care_instructions: Optional[str] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None
    is_new_arrival: Optional[bool] = None
    is_best_seller: Optional[bool] = None
    is_published: Optional[bool] = None

class ProductCardResponse(BaseModel):
    id: int
    name: str
    slug: str
    sku: str
    category_name: Optional[str] = None
    brand: str
    mrp: float
    selling_price: float
    discount_percent: int
    rating: float
    review_count: int
    primary_image: Optional[str] = None
    hover_image: Optional[str] = None
    available_colors: List[str] = []
    available_sizes: List[str] = []
    is_new_arrival: bool
    is_trending: bool
    is_best_seller: bool
    in_stock: bool

    class Config:
        from_attributes = True

class ProductDetailResponse(BaseModel):
    id: int
    name: str
    slug: str
    sku: str
    category_id: int
    category_name: Optional[str] = None
    subcategory_id: Optional[int] = None
    subcategory_name: Optional[str] = None
    brand: str
    mrp: float
    selling_price: float
    discount_percent: int
    description: Optional[str] = None
    fabric: Optional[str] = None
    pattern: Optional[str] = None
    fit: Optional[str] = None
    occasion: Optional[str] = None
    care_instructions: Optional[str] = None
    rating: float
    review_count: int
    is_featured: bool
    is_trending: bool
    is_new_arrival: bool
    is_best_seller: bool
    is_published: bool
    images: List[ProductImageResponse] = []
    variants: List[ProductVariantResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- CART & WISHLIST SCHEMAS -----------------
class CartItemAdd(BaseModel):
    product_id: int
    variant_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    variant_id: int
    product_name: str
    product_slug: str
    color_name: str
    size: str
    price: float
    mrp: float
    quantity: int
    total_price: float
    image_url: Optional[str] = None
    stock_available: int

class CartResponse(BaseModel):
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    discount: float = 0.0
    delivery_fee: float = 0.0
    tax_amount: float = 0.0
    total: float = 0.0
    applied_coupon: Optional[str] = None

class WishlistItemAdd(BaseModel):
    product_id: int

class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product: ProductCardResponse

# ----------------- COUPON SCHEMAS -----------------
class CouponBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: str = "percent"
    discount_value: float
    min_order_amount: float = 0.0
    max_discount_amount: Optional[float] = None
    expiry_date: Optional[datetime] = None
    usage_limit: int = 1000
    is_active: bool = True

class CouponCreate(CouponBase):
    pass

class CouponResponse(CouponBase):
    id: int
    usage_count: int

    class Config:
        from_attributes = True

class CouponValidateRequest(BaseModel):
    code: str
    cart_total: float

class CouponValidateResponse(BaseModel):
    is_valid: bool
    message: str
    discount_amount: float
    coupon_code: Optional[str] = None

# ----------------- ORDER SCHEMAS -----------------
class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    variant_id: Optional[int] = None
    product_name: str
    color: Optional[str] = None
    size: Optional[str] = None
    price: float
    quantity: int
    total_price: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    payment_method: str = "Cash on Delivery"
    coupon_code: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    subtotal: float
    discount_amount: float
    delivery_fee: float
    tax_amount: float
    total_amount: float
    coupon_code: Optional[str] = None
    payment_method: str
    payment_status: str
    order_status: str
    tracking_number: Optional[str] = None
    estimated_delivery: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    order_status: str
    payment_status: Optional[str] = None
    tracking_number: Optional[str] = None

# ----------------- RETURN REQUEST SCHEMAS -----------------
class ReturnRequestCreate(BaseModel):
    order_id: int
    order_item_id: Optional[int] = None
    reason: str
    details: Optional[str] = None

class ReturnRequestResponse(BaseModel):
    id: int
    order_id: int
    order_number: Optional[str] = None
    order_item_id: Optional[int] = None
    user_id: int
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    reason: str
    details: Optional[str] = None
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReturnStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None

# ----------------- REVIEW SCHEMAS -----------------
class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(ge=1, le=5)
    title: Optional[str] = None
    comment: str

class ReviewResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    user_id: int
    user_name: str
    rating: int
    title: Optional[str] = None
    comment: str
    is_verified_purchase: bool
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- BANNER SCHEMAS -----------------
class BannerBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    tag: Optional[str] = None
    image_url: str
    button_text: str = "Shop Now"
    button_link: str = "/shop"
    display_order: int = 0
    is_active: bool = True

class BannerCreate(BannerBase):
    pass

class BannerResponse(BannerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- ADMIN DASHBOARD STATS -----------------
class AdminDashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_customers: int
    total_products: int
    pending_orders_count: int
    pending_returns_count: int
    recent_orders: List[OrderResponse] = []
    daily_sales: List[dict] = []
    top_selling_products: List[dict] = []
