from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from app.core.database import get_db
from app.models.models import Product, ProductImage, ProductVariant, Category, Subcategory
from app.schemas.schemas import ProductCardResponse, ProductDetailResponse, ProductImageResponse, ProductVariantResponse

router = APIRouter(prefix="/products", tags=["Products"])

def map_product_to_card(product: Product) -> ProductCardResponse:
    images = sorted(product.images, key=lambda img: (not img.is_primary, img.display_order))
    primary_img = images[0].image_url if images else "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    hover_img = images[1].image_url if len(images) > 1 else primary_img

    colors = list(dict.fromkeys([v.color_name for v in product.variants if v.color_name]))
    sizes = list(dict.fromkeys([v.size for v in product.variants if v.size]))
    total_stock = sum(v.stock_quantity for v in product.variants) if product.variants else 0

    return ProductCardResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        sku=product.sku,
        category_name=product.category.name if product.category else "Dresses",
        brand=product.brand,
        mrp=product.mrp,
        selling_price=product.selling_price,
        discount_percent=product.discount_percent,
        rating=product.rating,
        review_count=product.review_count,
        primary_image=primary_img,
        hover_image=hover_img,
        available_colors=colors,
        available_sizes=sizes,
        is_new_arrival=product.is_new_arrival,
        is_trending=product.is_trending,
        is_best_seller=product.is_best_seller,
        in_stock=total_stock > 0
    )

@router.get("", response_model=dict)
def list_products(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Category slug or name"),
    subcategory: Optional[str] = Query(None, description="Subcategory slug or name"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    size: Optional[str] = Query(None, description="Comma separated sizes e.g. S,M,L"),
    color: Optional[str] = Query(None, description="Comma separated colors e.g. Pink,Blue"),
    fabric: Optional[str] = Query(None, description="Fabric type e.g. Silk,Cotton,Georgette"),
    occasion: Optional[str] = Query(None, description="Occasion e.g. Party,Casual,Wedding"),
    brand: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None),
    min_discount: Optional[int] = Query(None),
    in_stock: Optional[bool] = Query(None),
    is_featured: Optional[bool] = Query(None),
    is_trending: Optional[bool] = Query(None),
    is_new_arrival: Optional[bool] = Query(None),
    is_best_seller: Optional[bool] = Query(None),
    sort: Optional[str] = Query("featured", description="featured, newest, price_asc, price_desc, popular, rating, discount"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50)
):
    query = db.query(Product).filter(Product.is_published == True)

    # Search filter
    if q:
        search_pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.description.ilike(search_pattern),
                Product.fabric.ilike(search_pattern),
                Product.pattern.ilike(search_pattern),
                Product.occasion.ilike(search_pattern),
                Product.brand.ilike(search_pattern)
            )
        )

    # Category filter
    if category:
        query = query.join(Product.category).filter(
            or_(Category.slug == category.lower(), Category.name.ilike(category))
        )

    # Subcategory filter
    if subcategory:
        query = query.join(Product.subcategory).filter(
            or_(Subcategory.slug == subcategory.lower(), Subcategory.name.ilike(subcategory))
        )

    # Price range
    if min_price is not None:
        query = query.filter(Product.selling_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.selling_price <= max_price)

    # Fabric, Occasion, Brand, Rating, Discount
    if fabric:
        query = query.filter(Product.fabric.ilike(f"%{fabric}%"))
    if occasion:
        query = query.filter(Product.occasion.ilike(f"%{occasion}%"))
    if brand:
        query = query.filter(Product.brand.ilike(brand))
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)
    if min_discount is not None:
        query = query.filter(Product.discount_percent >= min_discount)

    # Collection flags
    if is_featured:
        query = query.filter(Product.is_featured == True)
    if is_trending:
        query = query.filter(Product.is_trending == True)
    if is_new_arrival:
        query = query.filter(Product.is_new_arrival == True)
    if is_best_seller:
        query = query.filter(Product.is_best_seller == True)

    # Size and Color filters (join variants)
    if size or color or in_stock:
        query = query.join(Product.variants)
        if size:
            size_list = [s.strip().upper() for s in size.split(",") if s.strip()]
            query = query.filter(ProductVariant.size.in_(size_list))
        if color:
            color_list = [c.strip() for c in color.split(",") if c.strip()]
            query = query.filter(ProductVariant.color_name.in_(color_list))
        if in_stock:
            query = query.filter(ProductVariant.stock_quantity > 0)
        query = query.distinct()

    # Sorting
    if sort == "newest":
        query = query.order_by(desc(Product.created_at))
    elif sort == "price_asc":
        query = query.order_by(asc(Product.selling_price))
    elif sort == "price_desc":
        query = query.order_by(desc(Product.selling_price))
    elif sort == "popular":
        query = query.order_by(desc(Product.is_trending), desc(Product.review_count))
    elif sort == "rating":
        query = query.order_by(desc(Product.rating), desc(Product.review_count))
    elif sort == "discount":
        query = query.order_by(desc(Product.discount_percent))
    else:  # "featured"
        query = query.order_by(desc(Product.is_featured), desc(Product.is_trending), desc(Product.id))

    total = query.count()
    products = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": [map_product_to_card(p) for p in products],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/{id_or_slug}", response_model=ProductDetailResponse)
def get_product(id_or_slug: str, db: Session = Depends(get_db)):
    if id_or_slug.isdigit():
        product = db.query(Product).filter(Product.id == int(id_or_slug), Product.is_published == True).first()
    else:
        product = db.query(Product).filter(Product.slug == id_or_slug, Product.is_published == True).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductDetailResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        sku=product.sku,
        category_id=product.category_id,
        category_name=product.category.name if product.category else "Dresses",
        subcategory_id=product.subcategory_id,
        subcategory_name=product.subcategory.name if product.subcategory else None,
        brand=product.brand,
        mrp=product.mrp,
        selling_price=product.selling_price,
        discount_percent=product.discount_percent,
        description=product.description,
        fabric=product.fabric,
        pattern=product.pattern,
        fit=product.fit,
        occasion=product.occasion,
        care_instructions=product.care_instructions,
        rating=product.rating,
        review_count=product.review_count,
        is_featured=product.is_featured,
        is_trending=product.is_trending,
        is_new_arrival=product.is_new_arrival,
        is_best_seller=product.is_best_seller,
        is_published=product.is_published,
        images=[ProductImageResponse.model_validate(img) for img in product.images],
        variants=[ProductVariantResponse.model_validate(var) for var in product.variants],
        created_at=product.created_at
    )
