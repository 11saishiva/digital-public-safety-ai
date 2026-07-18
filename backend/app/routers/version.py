from fastapi import APIRouter

from app.core.config import settings
from app.core.responses import success_response

router = APIRouter(
    prefix="/version",
    tags=["Version"],
)


@router.get("")
async def version():
    return success_response(
        "Version retrieved.",
        {
            "application": settings.APP_NAME,
            "version": settings.VERSION,
        },
    )
