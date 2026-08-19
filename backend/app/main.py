from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

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

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    ChurnService.load_model()
    yield

app: FastAPI = FastAPI(title="Ecommerce Shop API", lifespan=lifespan)

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
