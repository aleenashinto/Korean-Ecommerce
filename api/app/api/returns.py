from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Order, OrderItem, ReturnRequest
from app.schemas.schemas import ReturnRequestCreate, ReturnRequestResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/returns", tags=["Returns"])

def format_return_response(ret: ReturnRequest) -> ReturnRequestResponse:
    return ReturnRequestResponse(
        id=ret.id,
        order_id=ret.order_id,
        order_number=ret.order.order_number if ret.order else None,
        order_item_id=ret.order_item_id,
        user_id=ret.user_id,
        customer_name=f"{ret.user.first_name} {ret.user.last_name}" if ret.user else None,
        customer_email=ret.user.email if ret.user else None,
        reason=ret.reason,
        details=ret.details,
        status=ret.status,
        admin_notes=ret.admin_notes,
        created_at=ret.created_at
    )

@router.post("", response_model=ReturnRequestResponse)
def submit_return_request(
    return_in: ReturnRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify order belongs to user
    order = db.query(Order).filter(Order.id == return_in.order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if return already submitted for this order
    existing = db.query(ReturnRequest).filter(
        ReturnRequest.order_id == order.id,
        ReturnRequest.status.in_(["Pending", "Approved"])
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A return request has already been submitted for this order.")

    new_return = ReturnRequest(
        order_id=order.id,
        order_item_id=return_in.order_item_id,
        user_id=current_user.id,
        reason=return_in.reason,
        details=return_in.details,
        status="Pending"
    )
    db.add(new_return)
    db.commit()
    db.refresh(new_return)

    return format_return_response(new_return)

@router.get("", response_model=list[ReturnRequestResponse])
def get_user_return_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    returns = db.query(ReturnRequest).filter(ReturnRequest.user_id == current_user.id).order_by(ReturnRequest.id.desc()).all()
    return [format_return_response(r) for r in returns]
