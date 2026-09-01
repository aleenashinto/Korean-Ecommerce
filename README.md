# 👗 Ladies Collections (AuraLuxe) — AI-Powered E-Commerce Platform

A production-grade, full-stack AI-enhanced e-commerce platform for women's fashion, designer dresses, Indian couture, and Korean minimalist silhouettes.

Built with a high-performance **Python FastAPI** backend and a luxury **Next.js 14 (TypeScript + Tailwind CSS)** frontend.

---

## 🌟 Live Running Services

* **🛍️ Storefront Application**: [http://localhost:3000](http://localhost:3000)
* **👑 Admin Dashboard Studio**: [http://localhost:3000/admin](http://localhost:3000/admin)
* **🐍 Python FastAPI Backend**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **📖 Interactive API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔐 Default Demo Accounts (Pre-Seeded)

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@auraluxe.com` | `Admin@123` | Full access to `/admin` Studio, AI copywriter, fraud detection, inventory & orders |
| **👩 Customer** | `user@auraluxe.com` | `User@123` | Pre-configured with saved address, orders, and review history |

*(Both accounts feature **1-Click Demo Login** on the login page for instant reviewer testing)*

---

## 🧠 AI Intelligence Suite

1. **🤖 AI Virtual Stylist & Chatbot (`Ask Aura`)**:
   - Natural language conversational assistant across all pages.
   - Recommends outfits based on budget, fabric, and occasions with interactive product cards inside the chat.
   - Real-time order tracking lookups (`#ALX10025`) and return policy guidance.
2. **📸 AI Visual Image Search**:
   - Located via the **Camera Icon** in the top navigation bar.
   - Upload outfit inspiration photos or pick from preset trend styles to find matching catalog dresses with **Visual Similarity Match %** (e.g. *96% Match*).
3. **📏 AI Intelligent Size & Fit Finder**:
   - Interactive measurement sliders on every product page (Bust, Waist, Hips, Height) + Fit Preference toggle.
   - Recommends optimal size (`XS`–`XXL`) with fabric stretch notes and confidence scores.
4. **✨ Complete-The-Look Outfit Bundling**:
   - AI curated styling ensembles (matching jewelry, clutches, and heels) with a **1-click 15% discount bundle purchase**.
5. **💬 AI Review Sentiment Analyzer**:
   - Automatically summarizes verified buyer feedback into top praises and sizing tips on the Product Details page.
6. **✍️ Admin AI Luxury Copywriter**:
   - **1-Click Generation** inside the Add Product Studio for luxury descriptions, bullet points, SEO titles, and social captions.
7. **🛡️ Admin AI Fraud & COD Risk Engine**:
   - Evaluates order risk level (*LOW*, *MEDIUM*, *HIGH*) based on COD values, phone anomalies, and velocity.

---

## 📁 Project Structure

```
d:/Korean dress/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # Endpoints (auth, products, cart, orders, ai, admin...)
│   │   ├── core/             # Database engine, JWT security, config
│   │   ├── models/           # SQLAlchemy ORM models (Variants, Orders, Reviews...)
│   │   ├── schemas/          # Pydantic v2 schemas
│   │   └── services/         # Seed data generator & initial catalog
│   ├── auraluxe.db           # SQLite database file
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Backend launcher script
│
└── frontend/                 # Next.js 14 App Router Frontend
    ├── src/
    │   ├── app/              # 29 App Router pages (Storefront, PDP, Cart, Admin...)
    │   │   ├── account/      # Customer Dashboard & AI Style Profile (/account/style-profile)
    │   │   ├── admin/        # Admin Dashboard, Products Studio (/admin/products/new), AI Insights
    │   │   ├── lookbook/     # Editorial Shoppable Lookbook (/lookbook)
    │   │   ├── faq/          # Customer FAQ & Policy Hub (/faq)
    │   │   ├── product/[id]/ # Rich Product Detail Page with AI Size Finder & Bundle
    │   │   └── ...           # Cart, Checkout, Orders, Wishlist, Shop
    │   ├── components/       # Reusable components (Navbar, Footer, ProductCard, AI Widgets...)
    │   ├── context/          # React Contexts (Auth, Cart, Wishlist)
    │   ├── lib/              # API client wrapper & utilities
    │   └── types/            # TypeScript interfaces
    ├── tailwind.config.ts    # Luxury Rose-Gold & Champagne theme
    └── package.json          # Dependencies & build scripts
```

---

## 🚀 Getting Started

### 1. Backend Launch
```bash
cd backend
venv\Scripts\activate
python run.py
```

### 2. Frontend Launch
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the live application.
