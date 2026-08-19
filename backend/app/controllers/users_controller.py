from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import get_current_user_id
from app.models.user_schema import UserRecord, UserUpdate
from app.services.users_service import UsersService

router: APIRouter = APIRouter(prefix="/users", tags=["Users"])


@router.get(path="/me")
def get_profile(
        user_id: int = Depends(dependency=get_current_user_id),
) -> UserRecord:
    return UsersService.get_profile(user_id)


@router.patch(path="/me")
def update_profile(
        user_data: UserUpdate,
        user_id: int = Depends(dependency=get_current_user_id),
) -> UserRecord:
    return UsersService.update_profile(user_id, user_data)


@router.delete(path="/me")
def delete_account(
        user_id: int = Depends(dependency=get_current_user_id),
) -> dict[str, str]:
    UsersService.delete_account(user_id)
    return {"message": "Account deleted successfully"}
