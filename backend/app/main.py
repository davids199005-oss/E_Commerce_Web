from fastapi import FastAPI
from app.controllers import auth_controller

app = FastAPI(title="Ecommerce api")

app.include_router(auth_controller.router)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}