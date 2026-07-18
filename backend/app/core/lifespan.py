from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logging_config import logger
from app.core.paths import (
    DATABASE_DIR,
    LOG_DIR,
    MODEL_DIR,
    UPLOAD_DIR,
)
from app.db import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Digital Public Safety AI...")

    directories = [
        UPLOAD_DIR,
        MODEL_DIR,
        LOG_DIR,
        DATABASE_DIR,
    ]

    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)

    Base.metadata.create_all(bind=engine)

    logger.info("Database initialized.")

    yield

    logger.info("Application shutdown.")
