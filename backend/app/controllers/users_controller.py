from fastapi import APIRouter, Depends, HTTPException, status

from app.exceptions.app_exceptions import NotFoundError
from app.middleware.auth_middleware import get_current_user_id
from app.services.auth_service import AuthService

router: APIRouter = APIRouter(prefix="/users", tags=["Users"])


@router.delete(path="/me")
def delete_account(
        user_id: int = Depends(dependency=get_current_user_id),
) -> dict[str, str]:
    try:
        AuthService.delete_account(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return {"message": "Account deleted successfully"}