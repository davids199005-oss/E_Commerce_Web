from typing import Any, cast

from app.cache.redis_client import cache_client
from app.enums.filter_operator import FilterOperator
from app.exceptions.app_exceptions import ValidationError
from app.models.item_schema import ItemRecord
from app.repositories.items_repository import ItemsRepository
from app.config.config import settings



class ItemsService:
    @staticmethod
    def get_all_items() -> list[ItemRecord]:
        cache_items: list[dict[str, Any]] | dict[str, Any] | None = cache_client.get_json(key=settings.ITEMS_CACHE_KEY)
        if isinstance(cache_items, list):
            return cast(list[ItemRecord], cache_items)
        items: list[ItemRecord] = ItemsRepository.get_all_items()
        cache_client.set_json(key=settings.ITEMS_CACHE_KEY, value=items, ttl_seconds=settings.ITEMS_CACHE_TTL_SECONDS)
        return items

    @staticmethod
    def delete_all_items_cache() -> None:
        cache_client.delete(key=settings.ITEMS_CACHE_KEY)

    @staticmethod
    def search_items(
            names: list[str] | None = None,
            price_op: FilterOperator | None = None,
            price_value: float | None = None,
            stock_op: FilterOperator | None = None,
            stock_value: int | None = None,
    ) -> list[ItemRecord]:
        if price_op is not None and price_value is None:
            raise ValidationError("price_value is required when price_op is provided")

        if stock_op is not None and stock_value is None:
            raise ValidationError("stock_value is required when stock_op is provided")

        return ItemsRepository.search_items(
            names=names,
            price_op=price_op,
            price_value=price_value,
            stock_op=stock_op,
            stock_value=stock_value,
        )
