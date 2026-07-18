from typing import Any

from app.schemas.common import (
    ErrorResponse,
    PaginatedResponse,
    SuccessResponse,
)


def success_response(
    message: str,
    data: Any = None,
) -> SuccessResponse:
    return SuccessResponse(
        message=message,
        data=data,
    )


def error_response(
    message: str,
    errors: Any = None,
) -> ErrorResponse:
    return ErrorResponse(
        message=message,
        errors=errors,
    )


def paginated_response(
    message: str,
    data: list[Any],
    total: int,
    skip: int,
    limit: int,
) -> PaginatedResponse:
    return PaginatedResponse(
        message=message,
        data=data,
        total=total,
        skip=skip,
        limit=limit,
    )
