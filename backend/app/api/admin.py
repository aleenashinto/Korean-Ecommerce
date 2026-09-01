import re
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from app.core.database import get_db
from app.models.models import (
    User, Role, Product, ProductImage, ProductVariant, Category, Subcategory,
    Order, OrderItem, Coupon, Banner, Review, ReturnRequest
)
from app.schemas.schemas import (
    AdminDashboardStats, OrderResponse, OrderStatusUpdate,
    ProductCreate, ProductUpdate, ProductDetailResponse,
    CategoryCreate, CategoryResponse, SubcategoryCreate, SubcategoryResponse,
    CouponCreate, CouponResponse, BannerCreate, BannerResponse,
    ReturnRequestResponse, ReturnStatusUpdate, ReviewResponse
)
from app.api.deps import get_current_admin
from app.api.orders import format_order_response
from app.api.returns import format_return_response
from app.api.reviews import format_review_response

router = APIRouter(prefix="/admin", tags=["Admin Operations"], dependencies=[Depends(get_current_admin)])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

# ----------------- ADMIN DASHBOARD STATS -----------------
@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Total revenue from delivered or confirmed orders
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.order_status != "Cancelled"
    ).scalar() or 0.0

    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_customers = db.query(func.count(User.id)).filter(User.role_id == 1).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0

    pending_orders = db.query(func.count(Order.id)).filter(
        Order.order_status.in_(["Pending", "Processing", "Confirmed"])
    ).scalar() or 0

    pending_returns = db.query(func.count(ReturnRequest.id)).filter(
        ReturnRequest.status == "Pending"
    ).scalar() or 0

    recent_orders_raw = db.query(Order).order_by(Order.id.desc()).limit(10).all()
    recent_orders = [format_order_response(o) for o in recent_orders_raw]

    # Daily sales for the last 7 days
    daily_sales = []
    today = datetime.now(timezone.utc).date()
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        
        day_rev = db.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= day_start,
            Order.created_at <= day_end,
            Order.order_status != "Cancelled"
        ).scalar() or 0.0

        day_count = db.query(func.count(Order.id)).filter(
            Order.created_at >= day_start,
            Order.created_at <= day_end
        ).scalar() or 0

        daily_sales.append({
            "date": day.strftime("%b %d"),
            "revenue": round(float(day_rev), 2),
            "orders": day_count
        })

    # Top selling products
    top_items = db.query(
        OrderItem.product_name,
        func.sum(OrderItem.quantity).label("total_sold"),
        func.sum(OrderItem.total_price).label("total_amount")
    ).group_by(OrderItem.product_name).order_by(desc("total_sold")).limit(5).all()

    top_products_data = [
        {"name": item[0], "sold": int(item[1]), "revenue": float(item[2])}
        for item in top_items
    ]

    return AdminDashboardStats(
        total_revenue=round(float(total_revenue), 2),
        total_orders=total_orders,
        total_customers=total_customers,
        total_products=total_products,
        pending_orders_count=pending_orders,
        pending_returns_count=pending_returns,
        recent_orders=recent_orders,
        daily_sales=daily_sales,
        top_selling_products=top_products_data
    )

# ----------------- ADMIN PRODUCT MANAGEMENT -----------------
@router.get("/products", response_model=dict)
def admin_list_products(
    db: Session = Depends(get_db),
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    page: int = 1,
    limit: int = 20
):
    query = db.query(Product)
    if q:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{q}%"),
                Product.sku.ilike(f"%{q}%"),
                Product.brand.ilike(f"%{q}%")
            )
        )
    if category_id:
        query = query.filter(Product.category_id == category_id)

    total = query.count()
    products = query.order_by(Product.id.desc()).offset((page - 1) * limit).limit(limit).all()

    items = []
    for p in products:
        total_stock = sum(v.stock_quantity for v in p.variants) if p.variants else 0
        img = p.images[0].image_url if p.images else None
        items.append({
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "sku": p.sku,
            "category_name": p.category.name if p.category else None,
            "mrp": p.mrp,
            "selling_price": p.selling_price,
            "discount_percent": p.discount_percent,
            "stock_total": total_stock,
            "is_published": p.is_published,
            "is_featured": p.is_featured,
            "is_trending": p.is_trending,
            "rating": p.rating,
            "review_count": p.review_count,
            "image": img,
            "created_at": p.created_at
        })

    return {"items": items, "total": total, "page": page, "limit": limit}

@router.post("/products", response_model=dict)
def admin_create_product(prod_in: ProductCreate, db: Session = Depends(get_db)):
    # Generate unique slug
    base_slug = slugify(prod_in.name)
    slug = base_slug
    idx = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{idx}"
        idx += 1

    # Calculate discount if not provided
    disc = prod_in.discount_percent
    if (not disc or disc == 0) and prod_in.mrp > prod_in.selling_price:
        disc = int(round(((prod_in.mrp - prod_in.selling_price) / prod_in.mrp) * 100))

    new_prod = Product(
        name=prod_in.name.strip(),
        slug=slug,
        sku=prod_in.sku.strip().upper(),
        category_id=prod_in.category_id,
        subcategory_id=prod_in.subcategory_id,
        brand=prod_in.brand.strip(),
        mrp=prod_in.mrp,
        selling_price=prod_in.selling_price,
        discount_percent=disc or 0,
        description=prod_in.description,
        fabric=prod_in.fabric,
        pattern=prod_in.pattern,
        fit=prod_in.fit,
        occasion=prod_in.occasion,
        care_instructions=prod_in.care_instructions,
        is_featured=prod_in.is_featured,
        is_trending=prod_in.is_trending,
        is_new_arrival=prod_in.is_new_arrival,
        is_best_seller=prod_in.is_best_seller,
        is_published=prod_in.is_published,
        rating=5.0,
        review_count=0
    )
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)

    # Add images
    for i, img in enumerate(prod_in.images):
        p_img = ProductImage(
            product_id=new_prod.id,
            image_url=img.image_url,
            alt_text=img.alt_text or new_prod.name,
            is_primary=(i == 0) or img.is_primary,
            display_order=img.display_order or i
        )
        db.add(p_img)

    # Add variants (e.g. Color + Size)
    for var in prod_in.variants:
        var_sku = var.sku or f"{new_prod.sku}-{var.color_name[:2].upper()}-{var.size}"
        p_var = ProductVariant(
            product_id=new_prod.id,
            color_name=var.color_name,
            color_code=var.color_code or "#000000",
            size=var.size.upper(),
            stock_quantity=var.stock_quantity,
            sku=var_sku
        )
        db.add(p_var)

    db.commit()
    return {"message": "Product created successfully", "product_id": new_prod.id, "slug": new_prod.slug}

@router.put("/products/{product_id}", response_model=dict)
def admin_update_product(product_id: int, prod_in: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = prod_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(product, field, val)

    # Recompute discount
    if product.mrp and product.selling_price and product.mrp > product.selling_price:
        product.discount_percent = int(round(((product.mrp - product.selling_price) / product.mrp) * 100))

    db.commit()
    return {"message": "Product updated successfully"}

@router.delete("/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# ----------------- ADMIN ORDERS -----------------
@router.get("/orders", response_model=dict)
def admin_list_orders(
    db: Session = Depends(get_db),
    status: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    query = db.query(Order)
    if status and status != "All":
        query = query.filter(Order.order_status == status)
    if q:
        query = query.filter(
            or_(
                Order.order_number.ilike(f"%{q}%"),
                Order.shipping_name.ilike(f"%{q}%"),
                Order.shipping_phone.ilike(f"%{q}%")
            )
        )

    total = query.count()
    orders = query.order_by(Order.id.desc()).offset((page - 1) * limit).limit(limit).all()
    return {
        "items": [format_order_response(o) for o in orders],
        "total": total,
        "page": page,
        "limit": limit
    }

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def admin_update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = status_in.order_status
    if status_in.payment_status:
        order.payment_status = status_in.payment_status
    if status_in.tracking_number:
        order.tracking_number = status_in.tracking_number

    # If marked as Delivered, set payment to Paid if COD
    if status_in.order_status == "Delivered" and order.payment_status == "Pending":
        order.payment_status = "Paid"

    db.commit()
    db.refresh(order)
    return format_order_response(order)

# ----------------- ADMIN CATEGORIES -----------------
@router.post("/categories", response_model=CategoryResponse)
def admin_create_category(cat_in: CategoryCreate, db: Session = Depends(get_db)):
    slug = slugify(cat_in.slug or cat_in.name)
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name or slug already exists")

    new_cat = Category(
        name=cat_in.name.strip(),
        slug=slug,
        description=cat_in.description,
        image_url=cat_in.image_url,
        is_active=cat_in.is_active
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return CategoryResponse.model_validate(new_cat)

@router.delete("/categories/{cat_id}")
def admin_delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}

# ----------------- ADMIN CUSTOMERS -----------------
@router.get("/customers", response_model=list[dict])
def admin_list_customers(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role_id == 1).order_by(User.id.desc()).all()
    results = []
    for u in users:
        order_count = len(u.orders)
        total_spend = sum(o.total_amount for o in u.orders if o.order_status != "Cancelled")
        results.append({
            "id": u.id,
            "name": f"{u.first_name} {u.last_name}",
            "email": u.email,
            "phone": u.phone or "N/A",
            "order_count": order_count,
            "total_spend": round(total_spend, 2),
            "is_active": u.is_active,
            "created_at": u.created_at
        })
    return results

@router.put("/customers/{user_id}/toggle-status")
def admin_toggle_customer_status(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"Customer status changed to {'Active' if user.is_active else 'Deactivated'}", "is_active": user.is_active}

# ----------------- ADMIN INVENTORY -----------------
@router.get("/inventory", response_model=list[dict])
def admin_get_inventory(db: Session = Depends(get_db)):
    variants = db.query(ProductVariant).join(Product).order_by(ProductVariant.stock_quantity.asc()).all()
    results = []
    for v in variants:
        status_label = "In Stock" if v.stock_quantity > 5 else ("Low Stock" if v.stock_quantity > 0 else "Out of Stock")
        results.append({
            "variant_id": v.id,
            "product_id": v.product_id,
            "product_name": v.product.name if v.product else "Unknown",
            "sku": v.sku or (v.product.sku if v.product else "N/A"),
            "color": v.color_name,
            "size": v.size,
            "stock_quantity": v.stock_quantity,
            "status": status_label
        })
    return results

@router.put("/inventory/{variant_id}")
def admin_update_stock(variant_id: int, stock: int = Query(..., ge=0), db: Session = Depends(get_db)):
    v = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Variant not found")
    v.stock_quantity = stock
    db.commit()
    return {"message": "Stock updated successfully", "variant_id": v.id, "new_stock": v.stock_quantity}

# ----------------- ADMIN COUPONS -----------------
@router.get("/coupons", response_model=list[CouponResponse])
def admin_list_coupons(db: Session = Depends(get_db)):
    coupons = db.query(Coupon).order_by(Coupon.id.desc()).all()
    return [CouponResponse.model_validate(c) for c in coupons]

@router.post("/coupons", response_model=CouponResponse)
def admin_create_coupon(coupon_in: CouponCreate, db: Session = Depends(get_db)):
    code = coupon_in.code.strip().upper()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    new_coupon = Coupon(
        code=code,
        description=coupon_in.description,
        discount_type=coupon_in.discount_type,
        discount_value=coupon_in.discount_value,
        min_order_amount=coupon_in.min_order_amount,
        max_discount_amount=coupon_in.max_discount_amount,
        expiry_date=coupon_in.expiry_date,
        usage_limit=coupon_in.usage_limit,
        is_active=coupon_in.is_active
    )
    db.add(new_coupon)
    db.commit()
    db.refresh(new_coupon)
    return CouponResponse.model_validate(new_coupon)

@router.delete("/coupons/{coupon_id}")
def admin_delete_coupon(coupon_id: int, db: Session = Depends(get_db)):
    c = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(c)
    db.commit()
    return {"message": "Coupon deleted"}

# ----------------- ADMIN BANNERS -----------------
@router.get("/banners", response_model=list[BannerResponse])
def admin_list_banners(db: Session = Depends(get_db)):
    banners = db.query(Banner).order_by(Banner.display_order.asc(), Banner.id.desc()).all()
    return [BannerResponse.model_validate(b) for b in banners]

@router.post("/banners", response_model=BannerResponse)
def admin_create_banner(banner_in: BannerCreate, db: Session = Depends(get_db)):
    new_banner = Banner(
        title=banner_in.title,
        subtitle=banner_in.subtitle,
        tag=banner_in.tag,
        image_url=banner_in.image_url,
        button_text=banner_in.button_text,
        button_link=banner_in.button_link,
        display_order=banner_in.display_order,
        is_active=banner_in.is_active
    )
    db.add(new_banner)
    db.commit()
    db.refresh(new_banner)
    return BannerResponse.model_validate(new_banner)

@router.delete("/banners/{banner_id}")
def admin_delete_banner(banner_id: int, db: Session = Depends(get_db)):
    b = db.query(Banner).filter(Banner.id == banner_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Banner not found")
    db.delete(b)
    db.commit()
    return {"message": "Banner deleted"}

# ----------------- ADMIN RETURNS -----------------
@router.get("/returns", response_model=list[ReturnRequestResponse])
def admin_list_returns(db: Session = Depends(get_db)):
    returns = db.query(ReturnRequest).order_by(ReturnRequest.id.desc()).all()
    return [format_return_response(r) for r in returns]

@router.put("/returns/{return_id}/status", response_model=ReturnRequestResponse)
def admin_update_return_status(
    return_id: int,
    status_in: ReturnStatusUpdate,
    db: Session = Depends(get_db)
):
    ret = db.query(ReturnRequest).filter(ReturnRequest.id == return_id).first()
    if not ret:
        raise HTTPException(status_code=404, detail="Return request not found")

    ret.status = status_in.status
    if status_in.admin_notes:
        ret.admin_notes = status_in.admin_notes

    # If refunded, update the parent order payment status
    if status_in.status == "Refunded" and ret.order:
        ret.order.payment_status = "Refunded"

    db.commit()
    db.refresh(ret)
    return format_return_response(ret)

# ----------------- ADMIN REVIEWS -----------------
@router.get("/reviews", response_model=list[ReviewResponse])
def admin_list_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).order_by(Review.id.desc()).all()
    return [format_review_response(r) for r in reviews]

@router.delete("/reviews/{review_id}")
def admin_delete_review(review_id: int, db: Session = Depends(get_db)):
    rev = db.query(Review).filter(Review.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(rev)
    db.commit()
    return {"message": "Review deleted"}
