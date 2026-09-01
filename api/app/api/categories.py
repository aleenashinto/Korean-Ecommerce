from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Category, Subcategory, Product
from app.schemas.schemas import CategoryResponse, SubcategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).all()
    results = []
    for cat in categories:
        prod_count = db.query(func.count(Product.id)).filter(
            Product.category_id == cat.id, Product.is_published == True
        ).scalar() or 0
        
        subs = [SubcategoryResponse.model_validate(s) for s in cat.subcategories if s.is_active]
        results.append(
            CategoryResponse(
                id=cat.id,
                name=cat.name,
                slug=cat.slug,
                description=cat.description,
                image_url=cat.image_url,
                is_active=cat.is_active,
                created_at=cat.created_at,
                subcategories=subs,
                product_count=prod_count
            )
        )
    return results
