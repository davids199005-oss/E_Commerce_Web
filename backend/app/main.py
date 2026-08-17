from fastapi import FastAPI

from app.controllers import auth_controller, favorites_controller, items_controller, orders_controller

app: FastAPI = FastAPI(title="Ecommerce Shop API")

# Routers
app.include_router(auth_controller.router)
app.include_router(items_controller.router)
app.include_router(favorites_controller.router)
app.include_router(orders_controller.router)

# Health check
@app.get(path="/health")
def health_check() -> dict[str, str]:
    return {"status": "Healthy"}
