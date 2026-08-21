from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.config import settings
from app.controllers import (
    analytics_controller,
    auth_controller,
    chat_controller,
    favorites_controller,
    items_controller,
    orders_controller,
    users_controller,
)
from app.exceptions.app_exceptions import AppError
from app.middleware.exception_handler import app_error_handler
from app.middleware.rate_limit_middleware import RateLimitMiddleware
from app.services.churn_service import ChurnService
from app.services.items_service import ItemsService


# Lifespan (Load the model and ensure the catalog is seeded)
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    ChurnService.load_model()
    ItemsService.ensure_catalog_seeded()
    yield


app: FastAPI = FastAPI(title="Ecommerce Shop API", lifespan=lifespan)

# Rate Limit Middleware (Limit the number of requests to the API)
app.add_middleware(middleware_class=RateLimitMiddleware)

# CORS Middleware (Allow Cross-Origin Requests)
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler Middleware (Global)
app.add_exception_handler(exc_class_or_status_code=AppError, handler=app_error_handler)


# API Routers Endpoints
app.include_router(auth_controller.router)
app.include_router(items_controller.router)
app.include_router(favorites_controller.router)
app.include_router(orders_controller.router)
app.include_router(chat_controller.router)
app.include_router(analytics_controller.router)
app.include_router(users_controller.router)


# Health check Endpoint
@app.get(path="/")
def health_check() -> dict[str, str]:
    return {"status": "Healthy"}

# Pics Directory Middleware (Static Files)
app.mount(
    path="/pics",
    app=StaticFiles(directory=settings.PICS_DIRECTORY),
    name="pics",
)
