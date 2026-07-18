from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.constants import HealthStatus
from app.core.responses import success_response
from app.dependencies import get_db

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("")
async def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        database = "connected"

    except Exception:
        database = "disconnected"

    return success_response(
        "Health check successful.",
        {
            "api": HealthStatus.HEALTHY,
            "database": database,
        },
    )
