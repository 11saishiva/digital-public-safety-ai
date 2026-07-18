from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.responses import error_response


class ResourceNotFoundException(Exception):
    def __init__(self, message: str):
        self.message = message


class BadRequestException(Exception):
    def __init__(self, message: str):
        self.message = message


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(ResourceNotFoundException)
    async def not_found_handler(
        request: Request,
        exc: ResourceNotFoundException,
    ):
        return JSONResponse(
            status_code=404,
            content=error_response(exc.message).model_dump(mode="json"),
        )

    @app.exception_handler(BadRequestException)
    async def bad_request_handler(
        request: Request,
        exc: BadRequestException,
    ):
        return JSONResponse(
            status_code=400,
            content=error_response(exc.message).model_dump(mode="json"),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        return JSONResponse(
            status_code=422,
            content=error_response(
                "Validation failed.",
                exc.errors(),
            ).model_dump(mode="json"),
        )

    @app.exception_handler(Exception)
    async def global_handler(
        request: Request,
        exc: Exception,
    ):
        return JSONResponse(
            status_code=500,
            content=error_response(
                "Internal Server Error",
            ).model_dump(mode="json"),
        )
