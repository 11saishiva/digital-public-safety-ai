from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.responses import error_response


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):
        response = error_response("Internal Server Error")

        return JSONResponse(
            status_code=500,
            content=response.model_dump(mode="json"),
        )
