from app.exceptions.app_exceptions import ConflictError, NotFoundError
from app.repositories.favorites_repository import FavoritesRepository
from app.repositories.items_repository import ItemRecord, ItemsRepository


class FavoritesService:
    @staticmethod
    def get_favorites(user_id: int) -> list[ItemRecord]:
        return FavoritesRepository.get_favorites_by_user(user_id)

    @staticmethod
    def add_favorite(user_id: int, item_id: int) -> None:
        if ItemsRepository.get_item_by_id(item_id) is None:
            raise NotFoundError("Item not found")

        if FavoritesRepository.is_favorite(user_id, item_id):
            raise ConflictError("Item is already in favorites")

        FavoritesRepository.add_favorite(user_id, item_id)

    @staticmethod
    def remove_favorite(user_id: int, item_id: int) -> None:
        removed_rows: int = FavoritesRepository.remove_favorite(user_id, item_id)
        if removed_rows == 0:
            raise NotFoundError("Item is not in favorites")
