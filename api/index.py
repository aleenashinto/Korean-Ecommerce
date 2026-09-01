import sys
import os

# Add local api directory directly to sys.path so app imports natively
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app
from app.core.database import SessionLocal, init_db
from app.services.seed_data import seed_database

# Cold-start database table and seed initialization on Vercel
try:
    init_db()
    with SessionLocal() as db:
        seed_database(db)
except Exception as e:
    print(f"[VERCEL PYTHON BACKEND INIT]: {e}")
