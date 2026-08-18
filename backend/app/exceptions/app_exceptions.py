class AppError(Exception):
    pass


class NotFoundError(AppError):
    pass


class ConflictError(AppError):
    pass


class ValidationError(AppError):
    pass

class ServiceUnavailableError(AppError):
    pass

class RateLimitError(AppError):
    pass