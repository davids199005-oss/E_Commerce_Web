from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import get_current_user_id
from app.models.churn_schema import ChurnPrediction
from app.services.churn_service import ChurnService

router: APIRouter = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(path="/churn/me")
def get_churn_prediction(
        user_id: int = Depends(dependency=get_current_user_id),
) -> ChurnPrediction:
    return ChurnService.predict(user_id)
