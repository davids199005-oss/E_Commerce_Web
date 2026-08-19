from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import (
    analytics_controller,
    auth_controller,
    chat_controller,
    favorites_controller,
    items_controller,
    orders_controller,
    users_controller,
)
from app.services.churn_service import ChurnService
from app.exceptions.app_exceptions import AppError
from app.middleware.exception_handler import app_error_handler

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    ChurnService.load_model()
    yield

app: FastAPI = FastAPI(title="Ecommerce Shop API", lifespan=lifespan)

app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(exc_class_or_status_code=AppError, handler=app_error_handler)


# Routers
app.include_router(auth_controller.router)
app.include_router(items_controller.router)
app.include_router(favorites_controller.router)
app.include_router(orders_controller.router)
app.include_router(chat_controller.router)
app.include_router(analytics_controller.router)
app.include_router(users_controller.router)

# Health check
@app.get(path="/")
def health_check() -> dict[str, str]:
    return {"status": "Healthy"}
