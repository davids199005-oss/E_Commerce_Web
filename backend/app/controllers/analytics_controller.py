from fastapi import APIRouter, Depends, HTTPException, status

from app.exceptions.app_exceptions import NotFoundError, ServiceUnavailableError
from app.middleware.auth_middleware import get_current_user_id
from app.models.churn_schema import ChurnPrediction
from app.services.churn_service import ChurnService

router: APIRouter = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(path="/churn/me")
def get_churn_prediction(
        user_id: int = Depends(dependency=get_current_user_id),
) -> ChurnPrediction:
    try:
        return ChurnService.predict(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ServiceUnavailableError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e)
        )