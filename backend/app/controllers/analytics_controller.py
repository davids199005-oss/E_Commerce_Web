from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import require_admin
from app.models.churn_schema import ChurnPrediction
from app.services.churn_service import ChurnService

router: APIRouter = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    dependencies=[Depends(dependency=require_admin)],
)


@router.get(path="/churn/{user_id}")
def get_churn_prediction(user_id: int) -> ChurnPrediction:
    return ChurnService.predict(user_id)
