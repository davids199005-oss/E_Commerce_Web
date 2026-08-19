from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.exceptions.app_exceptions import (
    AppError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    RateLimitError,
    ServiceUnavailableError,
    ValidationError,
)

ERROR_STATUS_CODES: dict[type[AppError], int] = {
    NotFoundError: status.HTTP_404_NOT_FOUND,
    ConflictError: status.HTTP_409_CONFLICT,
    ValidationError: status.HTTP_400_BAD_REQUEST,
    RateLimitError: status.HTTP_429_TOO_MANY_REQUESTS,
    ServiceUnavailableError: status.HTTP_503_SERVICE_UNAVAILABLE,
    ForbiddenError: status.HTTP_403_FORBIDDEN,
}


async def app_error_handler(request: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, AppError):
        raise exc
    status_code: int = ERROR_STATUS_CODES.get(
        type(exc), status.HTTP_500_INTERNAL_SERVER_ERROR
    )
    return JSONResponse(status_code=status_code, content={"detail": str(exc)})
