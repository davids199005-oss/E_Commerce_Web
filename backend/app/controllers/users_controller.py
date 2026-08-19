from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import get_current_user_id
from app.services.auth_service import AuthService

router: APIRouter = APIRouter(prefix="/users", tags=["Users"])


@router.delete(path="/me")
def delete_account(
        user_id: int = Depends(dependency=get_current_user_id),
) -> dict[str, str]:
    AuthService.delete_account(user_id)
    return {"message": "Account deleted successfully"}
