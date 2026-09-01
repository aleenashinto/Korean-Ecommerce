from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.models import User, Role, Address, Cart, Wishlist
from app.schemas.schemas import (
    UserRegister, UserLogin, Token, UserResponse, UserUpdate,
    AddressCreate, AddressResponse
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        role_id=user.role_id,
        role_name=user.role.name if user.role else ("ADMIN" if user.role_id == 2 else "USER"),
        is_active=user.is_active,
        created_at=user.created_at,
        addresses=[AddressResponse.model_validate(addr) for addr in user.addresses]
    )

@router.post("/register", response_model=Token)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Fetch User role (role_id 1)
    user_role = db.query(Role).filter(Role.name == "USER").first()
    role_id = user_role.id if user_role else 1

    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        first_name=user_in.first_name.strip(),
        last_name=user_in.last_name.strip(),
        email=user_in.email.lower().strip(),
        phone=user_in.phone.strip() if user_in.phone else None,
        password_hash=hashed_pw,
        role_id=role_id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize empty cart and wishlist
    cart = Cart(user_id=new_user.id)
    wishlist = Wishlist(user_id=new_user.id)
    db.add(cart)
    db.add(wishlist)
    db.commit()

    token = create_access_token(
        subject=new_user.id,
        role="USER"
    )

    return Token(
        access_token=token,
        token_type="bearer",
        user=format_user_response(new_user)
    )

@router.post("/login", response_model=Token)
def login_user(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower().strip()).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )

    role_name = user.role.name if user.role else ("ADMIN" if user.role_id == 2 else "USER")
    token = create_access_token(
        subject=user.id,
        role=role_name
    )

    return Token(
        access_token=token,
        token_type="bearer",
        user=format_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return format_user_response(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    update_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_in.first_name is not None:
        current_user.first_name = update_in.first_name.strip()
    if update_in.last_name is not None:
        current_user.last_name = update_in.last_name.strip()
    if update_in.phone is not None:
        current_user.phone = update_in.phone.strip()

    db.commit()
    db.refresh(current_user)
    return format_user_response(current_user)

# Address endpoints
@router.get("/addresses", response_model=list[AddressResponse])
def get_user_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    addresses = db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.is_default.desc(), Address.id.desc()).all()
    return [AddressResponse.model_validate(a) for a in addresses]

@router.post("/addresses", response_model=AddressResponse)
def create_user_address(
    address_in: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # If set as default, unset other defaults
    if address_in.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    # If first address, auto make default
    existing_count = db.query(Address).filter(Address.user_id == current_user.id).count()
    is_def = True if existing_count == 0 else address_in.is_default

    new_address = Address(
        user_id=current_user.id,
        full_name=address_in.full_name,
        phone=address_in.phone,
        street_address=address_in.street_address,
        landmark=address_in.landmark,
        city=address_in.city,
        state=address_in.state,
        postal_code=address_in.postal_code,
        is_default=is_def
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return AddressResponse.model_validate(new_address)

@router.delete("/addresses/{address_id}")
def delete_user_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(address)
    db.commit()
    return {"message": "Address deleted successfully"}
