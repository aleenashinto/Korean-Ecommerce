from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Cart, CartItem, Product, ProductVariant, Wishlist, WishlistItem
from app.schemas.schemas import CartResponse, CartItemResponse, CartItemAdd, CartItemUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])

def get_or_create_user_cart(user_id: int, db: Session) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def build_cart_response(cart: Cart) -> CartResponse:
    item_responses = []
    subtotal = 0.0

    for item in cart.items:
        prod = item.product
        var = item.variant
        if not prod or not var:
            continue
        
        unit_price = prod.selling_price
        line_total = unit_price * item.quantity
        subtotal += line_total

        primary_img = None
        if prod.images:
            imgs = sorted(prod.images, key=lambda x: (not x.is_primary, x.display_order))
            primary_img = imgs[0].image_url

        item_responses.append(
            CartItemResponse(
                id=item.id,
                product_id=prod.id,
                variant_id=var.id,
                product_name=prod.name,
                product_slug=prod.slug,
                color_name=var.color_name,
                size=var.size,
                price=unit_price,
                mrp=prod.mrp,
                quantity=item.quantity,
                total_price=line_total,
                image_url=primary_img,
                stock_available=var.stock_quantity
            )
        )

    # Free delivery for orders above ₹999, else ₹99
    delivery_fee = 0.0 if (subtotal >= 999.0 or subtotal == 0.0) else 99.0
    tax_amount = round(subtotal * 0.05, 2)  # 5% GST
    total = round(subtotal + delivery_fee + tax_amount, 2)

    return CartResponse(
        items=item_responses,
        subtotal=round(subtotal, 2),
        discount=0.0,
        delivery_fee=delivery_fee,
        tax_amount=tax_amount,
        total=total
    )

@router.get("", response_model=CartResponse)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_user_cart(current_user.id, db)
    return build_cart_response(cart)

@router.post("/items", response_model=CartResponse)
def add_to_cart(
    item_in: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_user_cart(current_user.id, db)

    variant = db.query(ProductVariant).filter(
        ProductVariant.id == item_in.variant_id,
        ProductVariant.product_id == item_in.product_id
    ).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found")

    if variant.stock_quantity <= 0:
        raise HTTPException(status_code=400, detail="This variant is currently out of stock")

    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.variant_id == item_in.variant_id
    ).first()

    requested_qty = item_in.quantity
    if existing_item:
        new_total_qty = existing_item.quantity + requested_qty
        if new_total_qty > variant.stock_quantity:
            raise HTTPException(status_code=400, detail=f"Only {variant.stock_quantity} items available in stock")
        existing_item.quantity = new_total_qty
    else:
        if requested_qty > variant.stock_quantity:
            raise HTTPException(status_code=400, detail=f"Only {variant.stock_quantity} items available in stock")
        new_item = CartItem(
            cart_id=cart.id,
            product_id=item_in.product_id,
            variant_id=item_in.variant_id,
            quantity=requested_qty
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)

@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    update_in: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_user_cart(current_user.id, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if update_in.quantity <= 0:
        db.delete(item)
    else:
        if item.variant and update_in.quantity > item.variant.stock_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Only {item.variant.stock_quantity} items available in stock"
            )
        item.quantity = update_in.quantity

    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)

@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_user_cart(current_user.id, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)

@router.post("/items/{item_id}/move-to-wishlist", response_model=CartResponse)
def move_item_to_wishlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_user_cart(current_user.id, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    # Add to wishlist
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).first()
    if not wishlist:
        wishlist = Wishlist(user_id=current_user.id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)

    existing_wish = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.product_id == item.product_id
    ).first()
    if not existing_wish:
        w_item = WishlistItem(wishlist_id=wishlist.id, product_id=item.product_id)
        db.add(w_item)

    db.delete(item)
    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)

@router.delete("", response_model=CartResponse)
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_user_cart(current_user.id, db)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)
