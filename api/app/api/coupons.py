from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Coupon
from app.schemas.schemas import CouponResponse, CouponValidateRequest, CouponValidateResponse

router = APIRouter(prefix="/coupons", tags=["Coupons"])

@router.get("", response_model=list[CouponResponse])
def get_active_coupons(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    coupons = db.query(Coupon).filter(
        Coupon.is_active == True,
        (Coupon.expiry_date == None) | (Coupon.expiry_date >= now)
    ).all()
    return [CouponResponse.model_validate(c) for c in coupons]

@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(request: CouponValidateRequest, db: Session = Depends(get_db)):
    code = request.code.strip().upper()
    now = datetime.now(timezone.utc)
    coupon = db.query(Coupon).filter(
        Coupon.code == code,
        Coupon.is_active == True
    ).first()

    if not coupon:
        return CouponValidateResponse(
            is_valid=False,
            message="Invalid coupon code.",
            discount_amount=0.0
        )

    if coupon.expiry_date and coupon.expiry_date.replace(tzinfo=timezone.utc) < now:
        return CouponValidateResponse(
            is_valid=False,
            message="This coupon has expired.",
            discount_amount=0.0
        )

    if coupon.usage_count >= coupon.usage_limit:
        return CouponValidateResponse(
            is_valid=False,
            message="This coupon usage limit has been reached.",
            discount_amount=0.0
        )

    if request.cart_total < coupon.min_order_amount:
        return CouponValidateResponse(
            is_valid=False,
            message=f"Minimum order amount of ₹{coupon.min_order_amount:.0f} required for this coupon.",
            discount_amount=0.0
        )

    # Calculate discount
    if coupon.discount_type == "percent":
        discount = (coupon.discount_value / 100.0) * request.cart_total
        if coupon.max_discount_amount and discount > coupon.max_discount_amount:
            discount = coupon.max_discount_amount
    else:  # fixed
        discount = min(coupon.discount_value, request.cart_total)

    return CouponValidateResponse(
        is_valid=True,
        message=f"Coupon {coupon.code} applied successfully! You saved ₹{discount:.2f}",
        discount_amount=round(discount, 2),
        coupon_code=coupon.code
    )
