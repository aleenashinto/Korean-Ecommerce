import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import (
    User, Order, OrderItem, Cart, CartItem, ProductVariant, Coupon
)
from app.schemas.schemas import OrderCreate, OrderResponse, OrderItemResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

def generate_order_number() -> str:
    timestamp = datetime.now().strftime("%y%m%d")
    random_num = random.randint(1000, 9999)
    return f"ALX{timestamp}{random_num}"

def format_order_response(order: Order) -> OrderResponse:
    items = []
    for it in order.items:
        items.append(
            OrderItemResponse(
                id=it.id,
                product_id=it.product_id,
                variant_id=it.variant_id,
                product_name=it.product_name,
                color=it.color,
                size=it.size,
                price=it.price,
                quantity=it.quantity,
                total_price=it.total_price,
                image_url=it.image_url
            )
        )

    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        user_id=order.user_id,
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_state=order.shipping_state,
        shipping_postal_code=order.shipping_postal_code,
        subtotal=order.subtotal,
        discount_amount=order.discount_amount,
        delivery_fee=order.delivery_fee,
        tax_amount=order.tax_amount,
        total_amount=order.total_amount,
        coupon_code=order.coupon_code,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        tracking_number=order.tracking_number,
        estimated_delivery=order.estimated_delivery or "5-7 Business Days",
        created_at=order.created_at,
        items=items
    )

@router.post("", response_model=OrderResponse)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    # Validate stock and calculate subtotal
    subtotal = 0.0
    for item in cart.items:
        variant = item.variant
        if not variant or variant.stock_quantity < item.quantity:
            p_name = item.product.name if item.product else "Item"
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for '{p_name}' ({variant.color_name} / {variant.size}). Available: {variant.stock_quantity if variant else 0}"
            )
        subtotal += item.product.selling_price * item.quantity

    # Calculate discount from coupon if provided
    discount_amount = 0.0
    coupon = None
    if order_in.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == order_in.coupon_code.strip().upper(),
            Coupon.is_active == True
        ).first()
        if coupon and (not coupon.expiry_date or coupon.expiry_date.replace(tzinfo=timezone.utc) >= datetime.now(timezone.utc)):
            if subtotal >= coupon.min_order_amount:
                if coupon.discount_type == "percent":
                    discount_amount = (coupon.discount_value / 100.0) * subtotal
                    if coupon.max_discount_amount and discount_amount > coupon.max_discount_amount:
                        discount_amount = coupon.max_discount_amount
                else:
                    discount_amount = min(coupon.discount_value, subtotal)
                coupon.usage_count += 1

    delivery_fee = 0.0 if subtotal >= 999.0 else 99.0
    tax_amount = round(subtotal * 0.05, 2)
    total_amount = round(max(0.0, subtotal - discount_amount + delivery_fee + tax_amount), 2)

    order_num = generate_order_number()
    pay_status = "Paid" if order_in.payment_method in ["UPI", "Card", "Net Banking"] else "Pending"

    new_order = Order(
        order_number=order_num,
        user_id=current_user.id,
        shipping_name=order_in.shipping_name,
        shipping_phone=order_in.shipping_phone,
        shipping_address=order_in.shipping_address,
        shipping_city=order_in.shipping_city,
        shipping_state=order_in.shipping_state,
        shipping_postal_code=order_in.shipping_postal_code,
        subtotal=round(subtotal, 2),
        discount_amount=round(discount_amount, 2),
        delivery_fee=delivery_fee,
        tax_amount=tax_amount,
        total_amount=total_amount,
        coupon_code=coupon.code if coupon else None,
        payment_method=order_in.payment_method,
        payment_status=pay_status,
        order_status="Confirmed" if pay_status == "Paid" else "Pending",
        tracking_number=f"TRK{random.randint(10000000, 99999999)}",
        estimated_delivery="5-7 Business Days"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Add order items and deduct inventory
    for item in cart.items:
        prod = item.product
        var = item.variant
        primary_img = prod.images[0].image_url if prod.images else None

        # Deduct variant stock
        var.stock_quantity = max(0, var.stock_quantity - item.quantity)

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=prod.id,
            variant_id=var.id,
            product_name=prod.name,
            color=var.color_name,
            size=var.size,
            price=prod.selling_price,
            quantity=item.quantity,
            total_price=round(prod.selling_price * item.quantity, 2),
            image_url=primary_img
        )
        db.add(order_item)

    # Empty user's cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(new_order)

    return format_order_response(new_order)

@router.get("", response_model=list[OrderResponse])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.id.desc()).all()
    return [format_order_response(o) for o in orders]

@router.get("/{id_or_number}", response_model=OrderResponse)
def get_order_detail(
    id_or_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if id_or_number.isdigit():
        order = db.query(Order).filter(
            Order.id == int(id_or_number),
            Order.user_id == current_user.id
        ).first()
    else:
        order = db.query(Order).filter(
            Order.order_number == id_or_number,
            Order.user_id == current_user.id
        ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return format_order_response(order)
