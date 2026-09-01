from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import (
    Role, User, Category, Subcategory, Product, ProductImage, ProductVariant,
    Coupon, Banner, Order, OrderItem, Review, Address
)
from app.core.security import get_password_hash

def seed_database(db: Session):
    print("[INFO] Checking and seeding Korean Women's Dress Collections...")

    # 1. ROLES
    role_user = db.query(Role).filter(Role.name == "USER").first()
    if not role_user:
        role_user = Role(id=1, name="USER")
        db.add(role_user)

    role_admin = db.query(Role).filter(Role.name == "ADMIN").first()
    if not role_admin:
        role_admin = Role(id=2, name="ADMIN")
        db.add(role_admin)
    db.commit()

    # 2. USERS
    admin_user = db.query(User).filter(User.email == "admin@auraluxe.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@auraluxe.com",
            password_hash=get_password_hash("Admin@123"),
            first_name="Ji-eun",
            last_name="Park",
            phone="+82 10-1234-5678",
            role_id=2,
            is_active=True
        )
        db.add(admin_user)

    customer_user = db.query(User).filter(User.email == "user@auraluxe.com").first()
    if not customer_user:
        customer_user = User(
            email="user@auraluxe.com",
            password_hash=get_password_hash("User@123"),
            first_name="Ananya",
            last_name="Sharma",
            phone="+91 98765 43210",
            role_id=1,
            is_active=True
        )
        db.add(customer_user)
        db.commit()

        # Add customer default address
        addr = Address(
            user_id=customer_user.id,
            full_name="Ananya Sharma",
            phone="+91 98765 43210",
            street_address="Flat 402, Lotus Orchid, 12th Main Road, Indiranagar",
            landmark="Near Indiranagar Metro Station",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560038",
            is_default=True
        )
        db.add(addr)
    db.commit()

    # 3. KOREAN DRESS CATEGORIES & SUBCATEGORIES
    categories_data = [
        {
            "name": "K-Drama & Romance Dresses",
            "slug": "k-drama-dresses",
            "description": "Dreamy floral chiffon, tiered fairy midis, and puffed sleeve romantic dresses worn by your favorite Korean drama leads.",
            "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
            "subcategories": [
                {"name": "Floral Chiffon Midis", "slug": "floral-chiffon-midis"},
                {"name": "Fairy Puff Sleeve Dresses", "slug": "puff-sleeve-dresses"},
                {"name": "Tiered Ruffle Midis", "slug": "tiered-ruffle-midis"},
            ]
        },
        {
            "name": "Seoul Minimalist & Office Chic",
            "slug": "seoul-minimalist",
            "description": "Tailored tweed pinafores, structured blazer dresses, and clean pleated shirt dresses for sophisticated city elegance.",
            "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            "subcategories": [
                {"name": "Tweed Pinafores & Co-ords", "slug": "tweed-pinafores"},
                {"name": "Tailored Blazer Dresses", "slug": "blazer-dresses"},
                {"name": "Pleated Shirt Dresses", "slug": "pleated-shirt-dresses"},
            ]
        },
        {
            "name": "Hongdae Street & Y2K Babydolls",
            "slug": "hongdae-street",
            "description": "Trendy oversized babydoll dresses, ribbon bow satin slips, and Ulzzang daily streetwear fits.",
            "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
            "subcategories": [
                {"name": "Ulzzang Babydoll Dresses", "slug": "babydoll-dresses"},
                {"name": "Layered Slip Dresses", "slug": "layered-slip-dresses"},
                {"name": "Y2K Plaid & Pleats", "slug": "y2k-plaid-dresses"},
            ]
        },
        {
            "name": "Gangnam Evening & Cocktail Glam",
            "slug": "gangnam-glam",
            "description": "Sumptuous midnight velvet gowns, bodycon wrap drapes, and asymmetric satin evening showpieces.",
            "image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
            "subcategories": [
                {"name": "Velvet Wrap Evening Gowns", "slug": "velvet-evening-gowns"},
                {"name": "Asymmetric Satin Drape Dresses", "slug": "satin-drape-dresses"},
                {"name": "Cocktail Mermaid Slips", "slug": "mermaid-slips"},
            ]
        },
        {
            "name": "Modern Hanbok & Fusion Couture",
            "slug": "modern-hanbok",
            "description": "Traditional Korean Jeogori-inspired wrap bodices and organza chima silhouettes crafted for contemporary celebrations.",
            "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
            "subcategories": [
                {"name": "Jeogori Wrap Midi Dresses", "slug": "jeogori-wrap-dresses"},
                {"name": "Organza Chima Fusion Gowns", "slug": "organza-chima-gowns"},
            ]
        }
    ]

    for cat_data in categories_data:
        existing_cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not existing_cat:
            cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                image_url=cat_data["image_url"],
                is_active=True
            )
            db.add(cat)
            db.flush()
            for sub_data in cat_data["subcategories"]:
                sub = Subcategory(
                    category_id=cat.id,
                    name=sub_data["name"],
                    slug=sub_data["slug"],
                    is_active=True
                )
                db.add(sub)
    db.commit()

    # 4. KOREAN DRESSES PRODUCT CATALOG
    cat_kdrama = db.query(Category).filter(Category.slug == "k-drama-dresses").first()
    cat_seoul = db.query(Category).filter(Category.slug == "seoul-minimalist").first()
    cat_hongdae = db.query(Category).filter(Category.slug == "hongdae-street").first()
    cat_gangnam = db.query(Category).filter(Category.slug == "gangnam-glam").first()
    cat_hanbok = db.query(Category).filter(Category.slug == "modern-hanbok").first()

    products_data = [
        {
            "name": "Cherry Blossom Floral Chiffon Midi Dress",
            "slug": "cherry-blossom-floral-chiffon-midi-dress",
            "sku": "KOR-DR-001",
            "category_id": cat_kdrama.id if cat_kdrama else 1,
            "brand": "Chuu Seoul",
            "mrp": 3299.0,
            "selling_price": 1999.0,
            "discount_percent": 39,
            "description": "Straight out of a romance K-Drama, this ethereal dress is crafted in airy Korean georgette chiffon with delicate cherry blossom prints, fairy puffed sleeves, and a flattering smocked back waist.",
            "fabric": "Korean Chiffon with Soft Rayon Lining",
            "pattern": "Cherry Blossom Floral",
            "fit": "Fit & Flare with Smocked Waist",
            "occasion": "K-Drama Romantic Date & Han River Brunch",
            "care_instructions": "Hand wash gently in cold water. Do not tumble dry.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": True,
            "is_best_seller": True,
            "rating": 4.9,
            "review_count": 28,
            "images": [
                {"url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                {"url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
            ],
            "variants": [
                {"color": "Sakura Pink", "code": "#FFB6C1", "sizes": [("XS", 10), ("S", 18), ("M", 25), ("L", 12), ("XL", 6), ("XXL", 4)]},
                {"color": "Butter Yellow", "code": "#FFFDD0", "sizes": [("S", 12), ("M", 15), ("L", 8)]},
            ]
        },
        {
            "name": "Seoul Minimalist Tweed Pinafore Dress",
            "slug": "seoul-minimalist-tweed-pinafore-dress",
            "sku": "KOR-DR-002",
            "category_id": cat_seoul.id if cat_seoul else 2,
            "brand": "Stylenanda Korea",
            "mrp": 4499.0,
            "selling_price": 2799.0,
            "discount_percent": 38,
            "description": "Impeccably tailored in structured Korean bouclé tweed with delicate pearl button accents. Layer over a crisp chiffon blouse or wear solo for instant Gangnam corporate sophistication.",
            "fabric": "Korean Bouclé Tweed with Satin Lining",
            "pattern": "Houndstooth / Tweed Weave",
            "fit": "Structured A-Line Pinafore",
            "occasion": "Seoul Office Chic & Gallery Openings",
            "care_instructions": "Dry clean recommended to preserve tweed texture.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": True,
            "is_best_seller": True,
            "rating": 4.8,
            "review_count": 34,
            "images": [
                {"url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                {"url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
            ],
            "variants": [
                {"color": "Oatmeal Tweed", "code": "#E6DFD5", "sizes": [("XS", 8), ("S", 20), ("M", 22), ("L", 14), ("XL", 6)]},
                {"color": "Midnight Charcoal", "code": "#2B2B2B", "sizes": [("S", 10), ("M", 15), ("L", 10)]},
            ]
        },
        {
            "name": "Hongdae Pastel Plaid Babydoll Mini Dress",
            "slug": "hongdae-pastel-plaid-babydoll-mini-dress",
            "sku": "KOR-DR-003",
            "category_id": cat_hongdae.id if cat_hongdae else 3,
            "brand": "Mixxmix Hongdae",
            "mrp": 2799.0,
            "selling_price": 1699.0,
            "discount_percent": 39,
            "description": "The quintessential Ulzzang look! Features an empire babydoll silhouette, ruffled sailor collar, and pastel check pattern that pairs effortlessly with chunky loafers and knee-high socks.",
            "fabric": "Breathable Korean Poly-Cotton Twill",
            "pattern": "Pastel Gingham Plaid",
            "fit": "Relaxed Babydoll / Empire Flare",
            "occasion": "Hongdae Street Cafe Hopping & Pop Concerts",
            "care_instructions": "Machine wash cold with laundry bag.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": True,
            "is_best_seller": False,
            "rating": 4.7,
            "review_count": 19,
            "images": [
                {"url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
            ],
            "variants": [
                {"color": "Sky Blue Plaid", "code": "#87CEEB", "sizes": [("XS", 8), ("S", 15), ("M", 18), ("L", 10)]},
                {"color": "Lavender Plaid", "code": "#E6E6FA", "sizes": [("S", 12), ("M", 14), ("L", 8)]},
            ]
        },
        {
            "name": "Gangnam Midnight Velvet Draped Gown",
            "slug": "gangnam-midnight-velvet-draped-gown",
            "sku": "KOR-DR-004",
            "category_id": cat_gangnam.id if cat_gangnam else 4,
            "brand": "DABAGIRL Seoul",
            "mrp": 5499.0,
            "selling_price": 3299.0,
            "discount_percent": 40,
            "description": "Turn heads across Gangnam night clubs and red carpet galas. Sumptuous stretch Korean micro-velvet contours the body with a side ruched drape and an alluring high slit.",
            "fabric": "Korean Stretch Micro-Velvet",
            "pattern": "Lustrous Solid Velvet",
            "fit": "Bodycon Ruched Wrap with Thigh Slit",
            "occasion": "Cocktail Gala, Red Carpet & K-Pop Stage",
            "care_instructions": "Dry clean only. Do not iron directly.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": False,
            "is_best_seller": True,
            "rating": 5.0,
            "review_count": 42,
            "images": [
                {"url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
            ],
            "variants": [
                {"color": "Midnight Emerald", "code": "#046307", "sizes": [("XS", 6), ("S", 14), ("M", 18), ("L", 12), ("XL", 6)]},
                {"color": "Seoul Black", "code": "#1A1A1A", "sizes": [("S", 10), ("M", 12), ("L", 8)]},
            ]
        },
        {
            "name": "Modern Hanbok Organza Wrap Midi Dress",
            "slug": "modern-hanbok-organza-wrap-midi-dress",
            "sku": "KOR-DR-005",
            "category_id": cat_hanbok.id if cat_hanbok else 5,
            "brand": "Yeon Hanok Atelier",
            "mrp": 6299.0,
            "selling_price": 3999.0,
            "discount_percent": 36,
            "description": "A tribute to Korean heritage seamlessly fused with high fashion. Features a traditional Jeogori crossover neckline with hand-tied goreum ribbons and a sweeping pleated organza chima skirt.",
            "fabric": "Natural Korean Organza Silk Blend",
            "pattern": "Hand-embroidered Floral Motifs",
            "fit": "Crossover Wrap A-Line",
            "occasion": "Festive Celebrations, Weddings & High Tea",
            "care_instructions": "Specialist silk dry clean only.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": True,
            "is_best_seller": True,
            "rating": 4.9,
            "review_count": 22,
            "images": [
                {"url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
            ],
            "variants": [
                {"color": "Cloud White & Rose", "code": "#FFF5EE", "sizes": [("XS", 6), ("S", 12), ("M", 15), ("L", 10), ("XL", 4)]},
                {"color": "Sage Mint", "code": "#9CAF88", "sizes": [("S", 8), ("M", 10), ("L", 6)]},
            ]
        },
        {
            "name": "Butter Cream Pleated Shirtdress with Waist Belt",
            "slug": "butter-cream-pleated-shirtdress-with-waist-belt",
            "sku": "KOR-DR-006",
            "category_id": cat_seoul.id if cat_seoul else 2,
            "brand": "8Seconds Seoul",
            "mrp": 3199.0,
            "selling_price": 1899.0,
            "discount_percent": 41,
            "description": "The quintessential Korean influencer staple. Features clean lapel collars, fine knife-pleated skirt flow, and a matching fabric belt that snatches the waist.",
            "fabric": "High-Twist Korean Poly-Crepe",
            "pattern": "Solid Butter Yellow",
            "fit": "Tailored Shirt Fit with Flared Knife Pleats",
            "occasion": "Smart Casual, Gallery Outings & Sunday Brunch",
            "care_instructions": "Machine wash cold on gentle cycle.",
            "is_featured": True,
            "is_trending": False,
            "is_new_arrival": True,
            "is_best_seller": True,
            "rating": 4.8,
            "review_count": 16,
            "images": [
                {"url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
            ],
            "variants": [
                {"color": "Butter Cream", "code": "#FFF8DC", "sizes": [("XS", 8), ("S", 14), ("M", 18), ("L", 10)]},
            ]
        },
        {
            "name": "Soft Lavender Fairy Puff Sleeve Cottage Dress",
            "slug": "soft-lavender-fairy-puff-sleeve-cottage-dress",
            "sku": "KOR-DR-007",
            "category_id": cat_kdrama.id if cat_kdrama else 1,
            "brand": "Chuu Seoul",
            "mrp": 3499.0,
            "selling_price": 2099.0,
            "discount_percent": 40,
            "description": "Designed for idyllic summer vacations and romantic portraits. Draped in soft lavender cotton-gauze with structured puff sleeves and a sweetheart neckline.",
            "fabric": "Natural Bio-Washed Korean Cotton Gauze",
            "pattern": "Solid Pastel Lavender",
            "fit": "Sweetheart Neckline with Tiered Skirt",
            "occasion": "Vacation, Beach Sunsets & Outdoor Picnics",
            "care_instructions": "Hand wash cold. Line dry in shade.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": False,
            "is_best_seller": True,
            "rating": 4.9,
            "review_count": 31,
            "images": [
                {"url": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
            ],
            "variants": [
                {"color": "Soft Lavender", "code": "#E6E6FA", "sizes": [("XS", 10), ("S", 16), ("M", 20), ("L", 12), ("XL", 6)]},
            ]
        },
        {
            "name": "Seoul Y2K Ribbon Bow Satin Slip Dress",
            "slug": "seoul-y2k-ribbon-bow-satin-slip-dress",
            "sku": "KOR-DR-008",
            "category_id": cat_hongdae.id if cat_hongdae else 3,
            "brand": "Stylenanda Korea",
            "mrp": 2999.0,
            "selling_price": 1799.0,
            "discount_percent": 40,
            "description": "Minimalist Y2K K-fashion at its finest. Liquid satin slip with dainty ribbon tie shoulders and lace trim hem. Layer over baby tees for classic Hongdae aesthetic.",
            "fabric": "Liquid Silk Satin with Lace Trim",
            "pattern": "Solid Glossy Satin",
            "fit": "Bias-Cut Slip Silhouette",
            "occasion": "Casual Street, Lounge & Clubbing",
            "care_instructions": "Hand wash in cool water with silk detergent.",
            "is_featured": True,
            "is_trending": True,
            "is_new_arrival": True,
            "is_best_seller": False,
            "rating": 4.7,
            "review_count": 14,
            "images": [
                {"url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
            ],
            "variants": [
                {"color": "Onyx Black", "code": "#000000", "sizes": [("XS", 8), ("S", 12), ("M", 16), ("L", 8)]},
                {"color": "Pearl Champagne", "code": "#F7E7CE", "sizes": [("S", 10), ("M", 12), ("L", 6)]},
            ]
        }
    ]

    for p_data in products_data:
        existing_prod = db.query(Product).filter(Product.sku == p_data["sku"]).first()
        if not existing_prod:
            prod = Product(
                name=p_data["name"],
                slug=p_data["slug"],
                sku=p_data["sku"],
                category_id=p_data["category_id"],
                brand=p_data["brand"],
                mrp=p_data["mrp"],
                selling_price=p_data["selling_price"],
                discount_percent=p_data["discount_percent"],
                description=p_data["description"],
                fabric=p_data["fabric"],
                pattern=p_data["pattern"],
                fit=p_data["fit"],
                occasion=p_data["occasion"],
                care_instructions=p_data["care_instructions"],
                is_featured=p_data["is_featured"],
                is_trending=p_data["is_trending"],
                is_new_arrival=p_data["is_new_arrival"],
                is_best_seller=p_data["is_best_seller"],
                rating=p_data["rating"],
                review_count=p_data["review_count"],
                is_published=True
            )
            db.add(prod)
            db.flush()

            for img_info in p_data["images"]:
                img = ProductImage(
                    product_id=prod.id,
                    image_url=img_info["url"],
                    is_primary=img_info["is_primary"],
                    display_order=0
                )
                db.add(img)

            for var_info in p_data["variants"]:
                for size_name, qty in var_info["sizes"]:
                    variant = ProductVariant(
                        product_id=prod.id,
                        color_name=var_info["color"],
                        color_code=var_info["code"],
                        size=size_name,
                        stock_quantity=qty
                    )
                    db.add(variant)
    db.commit()

    # 5. KOREAN PROMO COUPONS
    coupons_data = [
        {"code": "SEOUL10", "type": "percent", "val": 10.0, "min_order": 999.0, "max_discount": 500.0, "desc": "10% OFF for all K-Fashion lovers on first order"},
        {"code": "KPOP20", "type": "percent", "val": 20.0, "min_order": 3499.0, "max_discount": 1000.0, "desc": "20% OFF on Gangnam evening gowns and Hanbok edits"},
        {"code": "YEON500", "type": "fixed", "val": 500.0, "min_order": 2499.0, "max_discount": 500.0, "desc": "Flat ₹500 discount on Seoul tweed and blazer dresses"},
        {"code": "ULZZANG15", "type": "percent", "val": 15.0, "min_order": 1499.0, "max_discount": 600.0, "desc": "15% OFF on Hongdae babydoll and cottagecore dresses"},
    ]

    for c_data in coupons_data:
        existing_c = db.query(Coupon).filter(Coupon.code == c_data["code"]).first()
        if not existing_c:
            cpn = Coupon(
                code=c_data["code"],
                description=c_data["desc"],
                discount_type=c_data["type"],
                discount_value=c_data["val"],
                min_order_amount=c_data["min_order"],
                max_discount_amount=c_data["max_discount"],
                usage_limit=1000,
                is_active=True
            )
            db.add(cpn)
    db.commit()

    # 6. SEOUL HERO BANNERS
    banners_data = [
        {
            "title": "Seoul Fashion Week 2026",
            "subtitle": "Curated runway dresses straight from Dongdaemun & Gangnam fashion ateliers.",
            "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1600&q=80",
            "tag": "NEW SEASON DROP",
            "btn_text": "Explore K-Dresses",
            "btn_link": "/shop",
            "order": 1
        },
        {
            "title": "K-Drama Romance Edit",
            "subtitle": "Pastel floral chiffon, fairy puffed sleeves, and effortless Parisian-Seoul charm.",
            "image_url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
            "tag": "TRENDING VIRAL",
            "btn_text": "Shop Romance",
            "btn_link": "/shop?category=k-drama-dresses",
            "order": 2
        },
        {
            "title": "Modern Hanbok Fusion Couture",
            "subtitle": "Timeless Korean Jeogori wraps and flowing organza skirts designed for modern royalty.",
            "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80",
            "tag": "HERITAGE ATELIER",
            "btn_text": "Discover Fusion",
            "btn_link": "/shop?category=modern-hanbok",
            "order": 3
        }
    ]

    for b_data in banners_data:
        existing_b = db.query(Banner).filter(Banner.title == b_data["title"]).first()
        if not existing_b:
            bnr = Banner(
                title=b_data["title"],
                subtitle=b_data["subtitle"],
                image_url=b_data["image_url"],
                tag=b_data["tag"],
                button_text=b_data["btn_text"],
                button_link=b_data["btn_link"],
                display_order=b_data["order"],
                is_active=True
            )
            db.add(bnr)
    db.commit()

    print("[INFO] Korean Women's Dress Collections seeding completed successfully!")
