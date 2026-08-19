from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.exceptions.app_exceptions import ForbiddenError
from app.repositories.users_repository import UsersRepository
from app.utils.jwt_util import JwtUtil

bearer_scheme: HTTPBearer = HTTPBearer()


def get_current_user_id(
        credentials: HTTPAuthorizationCredentials = Depends(dependency=bearer_scheme),
) -> int:
    user_id: int | None = JwtUtil.decode_token(token=credentials.credentials)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id


def require_admin(user_id: int = Depends(dependency=get_current_user_id)) -> int:
    if not UsersRepository.is_admin(user_id):
        raise ForbiddenError("Admin access required")
    return user_id
