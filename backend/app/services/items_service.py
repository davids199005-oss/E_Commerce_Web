from app.cache.redis_client import cache_client
from app.enums.filter_operator import FilterOperator
from app.repositories.items_repository import ItemsRepository

ITEMS_CACHE_KEY = "items:all"
ITEMS_CACHE_TTL_SECONDS = 300


class ItemsService:
    @staticmethod
    def get_all_items() -> list[dict]:
        cache_items = cache_client.get_json(ITEMS_CACHE_KEY)
        if cache_items is not None:
            return cache_items
        items = ItemsRepository.get_all_items()
        cache_client.set_json(ITEMS_CACHE_KEY, items, ITEMS_CACHE_TTL_SECONDS)
        return items

    @staticmethod
    def delete_all_items_cache() -> None:
        cache_client.delete(ITEMS_CACHE_KEY)

    @staticmethod
    def search_items(
            names: list[str] | None = None,
            price_op: FilterOperator | None = None,
            price_value: float | None = None,
            stock_op: FilterOperator | None = None,
            stock_value: int | None = None,
    ) -> list[dict]:
        if price_op is not None and price_value is None:
            raise ValueError("price_value is required when price_op is provided")

        if stock_op is not None and stock_value is None:
            raise ValueError("stock_value is required when stock_op is provided")

        return ItemsRepository.search_items(
            names=names,
            price_op=price_op,
            price_value=price_value,
            stock_op=stock_op,
            stock_value=stock_value,
        )
