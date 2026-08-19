from fastapi import APIRouter, Depends, status
from app.middleware.auth_middleware import get_current_user_id
from app.models.item_schema import ItemRecord
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
    FavoritesService.add_favorite(user_id, item_id)
    return {"message": "Item added to favorites"}


@router.delete(path="/{item_id}")
def remove_favorite(item_id: int, user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    FavoritesService.remove_favorite(user_id, item_id)
    return {"message": "Item removed from favorites"}
