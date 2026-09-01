from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import User, Product, Order, OrderItem, Review
from app.schemas.schemas import ReviewCreate, ReviewResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

def format_review_response(rev: Review) -> ReviewResponse:
    user_name = f"{rev.user.first_name} {rev.user.last_name}" if rev.user else "Anonymous Shopper"
    return ReviewResponse(
        id=rev.id,
        product_id=rev.product_id,
        product_name=rev.product.name if rev.product else None,
        user_id=rev.user_id,
        user_name=user_name,
        rating=rev.rating,
        title=rev.title,
        comment=rev.comment,
        is_verified_purchase=rev.is_verified_purchase,
        is_approved=rev.is_approved,
        created_at=rev.created_at
    )

@router.get("/product/{product_id}", response_model=list[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(
        Review.product_id == product_id,
        Review.is_approved == True
    ).order_by(Review.id.desc()).all()
    return [format_review_response(r) for r in reviews]

@router.post("", response_model=ReviewResponse)
def submit_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == review_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if user purchased the product
    has_purchased = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.product_id == review_in.product_id
    ).first() is not None

    # Check for existing review
    existing_review = db.query(Review).filter(
        Review.product_id == review_in.product_id,
        Review.user_id == current_user.id
    ).first()

    if existing_review:
        existing_review.rating = review_in.rating
        existing_review.title = review_in.title
        existing_review.comment = review_in.comment
        review_obj = existing_review
    else:
        review_obj = Review(
            product_id=review_in.product_id,
            user_id=current_user.id,
            rating=review_in.rating,
            title=review_in.title,
            comment=review_in.comment,
            is_verified_purchase=has_purchased,
            is_approved=True
        )
        db.add(review_obj)

    db.commit()
    db.refresh(review_obj)

    # Re-calculate product overall rating and count
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.product_id == product.id, Review.is_approved == True
    ).scalar() or 5.0
    total_reviews = db.query(func.count(Review.id)).filter(
        Review.product_id == product.id, Review.is_approved == True
    ).scalar() or 0

    product.rating = round(float(avg_rating), 1)
    product.review_count = total_reviews
    db.commit()

    return format_review_response(review_obj)
