from typing import Any, cast

from app.cache.redis_client import cache_client
from app.config.config import settings
from app.db.catalog_seed import image_urls_by_name, load_seed_sql
from app.enums.filter_operator import FilterOperator
from app.exceptions.app_exceptions import NotFoundError, ValidationError
from app.models.item_schema import (
    ItemCreate,
    ItemPatch,
    ItemRecord,
    ItemUpdate,
    ItemWrite,
)
from app.repositories.items_repository import ItemsRepository


class ItemsService:
    @staticmethod
    def _to_write(item: ItemCreate) -> ItemWrite:
        return {
            "name": item.name,
            "price_usd": item.price_usd,
            "stock_qty": item.stock_qty,
            "image_url": item.image_url,
        }

    @staticmethod
    def ensure_catalog_seeded() -> None:
        sql: str = load_seed_sql()
        if ItemsRepository.count_items() == 0:
            ItemsRepository.execute_seed(sql)
        ItemsRepository.backfill_image_urls(image_urls_by_name(sql))
        ItemsService.delete_all_items_cache()

    @staticmethod
    def add_item(item: ItemCreate) -> int:
        item_id: int = ItemsRepository.create_item(ItemsService._to_write(item))
        ItemsService.delete_all_items_cache()
        return item_id

    @staticmethod
    def update_item(item_id: int, item: ItemUpdate) -> None:
        fields: ItemPatch = cast(ItemPatch, item.model_dump(exclude_unset=True))
        if not fields:
            raise ValidationError("At least one field is required")
        if ItemsRepository.get_item_by_id(item_id) is None:
            raise NotFoundError("Item not found")
        ItemsRepository.update_item(item_id, fields)
        ItemsService.delete_all_items_cache()

    @staticmethod
    def delete_item(item_id: int) -> None:
        deleted_rows: int = ItemsRepository.delete_item(item_id)
        if deleted_rows == 0:
            raise NotFoundError("Item not found")
        ItemsService.delete_all_items_cache()

    @staticmethod
    def get_item_by_id(item_id: int) -> ItemRecord:
        item: ItemRecord | None = ItemsRepository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundError("Item not found")
        return item

    @staticmethod
    def get_all_items() -> list[ItemRecord]:
        cache_items: list[dict[str, Any]] | dict[str, Any] | None = (
            cache_client.get_json(key=settings.ITEMS_CACHE_KEY)
        )
        if isinstance(cache_items, list):
            return cast(list[ItemRecord], cache_items)
        items: list[ItemRecord] = ItemsRepository.get_all_items()
        cache_client.set_json(
            key=settings.ITEMS_CACHE_KEY,
            value=items,
            ttl_seconds=settings.ITEMS_CACHE_TTL_SECONDS,
        )
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
