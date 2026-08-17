

from fastapi import APIRouter, Depends, HTTPException, status

from app.exceptions.app_exceptions import ConflictError, NotFoundError
from app.middleware.auth_middleware import get_current_user_id
from app.repositories.items_repository import ItemRecord
from app.services.favorites_service import FavoritesService

router: APIRouter = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get(path="")
def get_favorites(user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, list[ItemRecord] | str]:
    favorites: list[ItemRecord] = FavoritesService.get_favorites(user_id)
    if not favorites:
        return {"items": [], "message": "Your favorites list is empty"}
    return {"items": favorites}


@router.post(path="/{item_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(item_id: int, user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    try:
        FavoritesService.add_favorite(user_id, item_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return {"message": "Item added to favorites"}


@router.delete(path="/{item_id}")
def remove_favorite(item_id: int, user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    try:
        FavoritesService.remove_favorite(user_id, item_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return {"message": "Item removed from favorites"}
