from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.api import auth, products, categories, cart, wishlist, coupons, orders, returns, reviews, banners, admin, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data
    print("[INFO] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown
    print("[INFO] Shutting down AuraLuxe Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="REST API for AuraLuxe — Women's Fashion E-Commerce Platform (2-Role: Customer & Admin)",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
api_v1_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(products.router, prefix=api_v1_prefix)
app.include_router(categories.router, prefix=api_v1_prefix)
app.include_router(cart.router, prefix=api_v1_prefix)
app.include_router(wishlist.router, prefix=api_v1_prefix)
app.include_router(coupons.router, prefix=api_v1_prefix)
app.include_router(orders.router, prefix=api_v1_prefix)
app.include_router(returns.router, prefix=api_v1_prefix)
app.include_router(reviews.router, prefix=api_v1_prefix)
app.include_router(banners.router, prefix=api_v1_prefix)
app.include_router(admin.router, prefix=api_v1_prefix)
app.include_router(ai.router, prefix=api_v1_prefix)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "Online",
        "docs": "/docs",
        "version": "1.0.0",
        "api_v1": api_v1_prefix
    }
