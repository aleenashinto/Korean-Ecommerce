from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Banner
from app.schemas.schemas import BannerResponse

router = APIRouter(prefix="/banners", tags=["Banners"])

@router.get("", response_model=list[BannerResponse])
def get_active_banners(db: Session = Depends(get_db)):
    banners = db.query(Banner).filter(
        Banner.is_active == True
    ).order_by(Banner.display_order.asc(), Banner.id.desc()).all()
    return [BannerResponse.model_validate(b) for b in banners]
