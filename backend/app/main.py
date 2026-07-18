from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

import app.db
from app.core.config import settings
from app.core.errors import register_exception_handlers
from app.core.lifespan import lifespan
from app.middleware.cors import add_cors
from app.middleware.logging import LoggingMiddleware
from app.routers import health, version
from app.routers.counterfeit import router as counterfeit_router
from app.routers.scam import router as scam_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)
app.mount(
    "/uploads",
    StaticFiles(directory="storage/uploads"),
    name="uploads",
)

add_cors(app)
app.add_middleware(LoggingMiddleware)

register_exception_handlers(app)

app.include_router(health.router)
app.include_router(version.router)

app.include_router(
    counterfeit_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    scam_router,
    prefix=settings.API_PREFIX,
)


@app.get("/", tags=["Root"])
async def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
    }
