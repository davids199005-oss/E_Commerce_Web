from fastapi import APIRouter, HTTPException, status

from app.models.user_schema import UserCreate, UserLogin
from app.services.auth_service import AuthService

router: APIRouter = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(path="/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate) -> dict[str, str]:
    AuthService.register(user_data)
    return {"message": "User registered successfully"}


@router.post(path="/login", status_code=status.HTTP_200_OK)
def login(credentials: UserLogin) -> dict[str, str]:
    token: str | None = AuthService.login(
        username=credentials.username, password=credentials.password
    )
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return {"token": token}
