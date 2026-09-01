import sys
import os

# Add backend directory to sys.path so app modules import cleanly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seed_data import seed_database

# Ensure database tables and seed data are initialized on Vercel cold start
try:
    init_db()
    with SessionLocal() as db:
        seed_database(db)
except Exception as e:
    print(f"[VERCEL COLD START INIT ERROR]: {e}")
