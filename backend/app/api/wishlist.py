from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Wishlist, WishlistItem, Product
from app.schemas.schemas import WishlistItemAdd
from app.api.products import map_product_to_card
from app.api.deps import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

def get_or_create_user_wishlist(user_id: int, db: Session) -> Wishlist:
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).first()
    if not wishlist:
        wishlist = Wishlist(user_id=user_id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
    return wishlist

@router.get("", response_model=list[dict])
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wishlist = get_or_create_user_wishlist(current_user.id, db)
    results = []
    for item in wishlist.items:
        if item.product and item.product.is_published:
            prod_card = map_product_to_card(item.product)
            results.append({
                "id": item.id,
                "product_id": item.product_id,
                "created_at": item.created_at,
                "product": prod_card.model_dump()
            })
    return results

@router.post("/items", response_model=dict)
def toggle_wishlist_item(
    item_in: WishlistItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    wishlist = get_or_create_user_wishlist(current_user.id, db)
    existing = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.product_id == item_in.product_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Removed from wishlist", "in_wishlist": False, "product_id": item_in.product_id}
    else:
        new_item = WishlistItem(wishlist_id=wishlist.id, product_id=item_in.product_id)
        db.add(new_item)
        db.commit()
        return {"message": "Added to wishlist", "in_wishlist": True, "product_id": item_in.product_id}

@router.delete("/items/{product_id}")
def remove_from_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wishlist = get_or_create_user_wishlist(current_user.id, db)
    existing = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.product_id == product_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()

    return {"message": "Item removed from wishlist", "in_wishlist": False}
