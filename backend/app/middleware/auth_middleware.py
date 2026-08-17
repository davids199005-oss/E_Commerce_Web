from fastapi.security.http import HTTPBearer


from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

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
