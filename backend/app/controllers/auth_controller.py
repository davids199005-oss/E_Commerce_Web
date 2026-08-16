from fastapi import APIRouter, HTTPException, status
from app.models.user_schema import UserCreate, UserLogin
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate) -> dict:
    try:
        AuthService.register(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return {"message": "User registered successfully"}


@router.post("/login", status_code=status.HTTP_200_OK)
def login(credentials: UserLogin) -> dict:
    token = AuthService.login(credentials.username, credentials.password)
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return {"token": token}
