from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

STORAGE_DIR = BASE_DIR / "storage"

UPLOAD_DIR = STORAGE_DIR / "uploads"

MODEL_DIR = STORAGE_DIR / "models"

LOG_DIR = STORAGE_DIR / "logs"

DATABASE_DIR = STORAGE_DIR / "database"

DATABASE_FILE = DATABASE_DIR / "digital_public_safety.db"
