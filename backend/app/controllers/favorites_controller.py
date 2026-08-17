from fastapi import APIRouter, Depends, HTTPException, status

from app.exceptions.app_exceptions import ConflictError, NotFoundError
from app.middleware.auth_middleware import get_current_user_id
from app.services.favorites_service import FavoritesService

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("")
def get_favorites(user_id: int = Depends(get_current_user_id)) -> dict:
    favorites = FavoritesService.get_favorites(user_id)
    if not favorites:
        return {"items": [], "message": "Your favorites list is empty"}
    return {"items": favorites}


@router.post("/{item_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(item_id: int, user_id: int = Depends(get_current_user_id)) -> dict:
    try:
        FavoritesService.add_favorite(user_id, item_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return {"message": "Item added to favorites"}


@router.delete("/{item_id}")
def remove_favorite(item_id: int, user_id: int = Depends(get_current_user_id)) -> dict:
    try:
        FavoritesService.remove_favorite(user_id, item_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return {"message": "Item removed from favorites"}
