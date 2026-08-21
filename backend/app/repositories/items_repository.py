from decimal import Decimal
from typing import cast

from app.db.connection import get_connection
from app.enums.filter_operator import FilterOperator
from app.enums.operator_sql import OPERATOR_SQL
from app.models.item_schema import ItemPatch, ItemRecord, ItemWrite

type QueryParam = str | float | int
_ITEM_PATCH_COLUMNS: frozenset[str] = frozenset(
    {"name", "price_usd", "stock_qty", "image_url"}
)
_ITEM_SELECT: str = "SELECT id, name, price_usd, stock_qty, image_url FROM items"


class ItemsRepository:
    @staticmethod
    def get_all_items() -> list[ItemRecord]:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(_ITEM_SELECT)
            return cast(list[ItemRecord], cursor.fetchall())

    @staticmethod
    def get_item_by_id(item_id: int) -> ItemRecord | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                f"{_ITEM_SELECT} WHERE id = %s",
                (item_id,),
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return cast(ItemRecord, row)

    @staticmethod
    def create_item(item: ItemWrite) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                """
                INSERT INTO items (name, price_usd, stock_qty, image_url)
                VALUES (%s, %s, %s, %s)
                """,
                (item["name"], item["price_usd"], item["stock_qty"], item["image_url"]),
            )
            connection.commit()
            inserted_id: int | None = cursor.lastrowid
            if inserted_id is None:
                raise RuntimeError("Insert did not return an id")
            return inserted_id

    @staticmethod
    def update_item(item_id: int, item: ItemPatch) -> int:
        if not item:
            return 0

        assignments: list[str] = [
            f"{column} = %s" for column in item if column in _ITEM_PATCH_COLUMNS
        ]
        if not assignments:
            return 0
        params: list[str | Decimal | int | None] = [
            item[column] for column in item if column in _ITEM_PATCH_COLUMNS
        ]
        params.append(item_id)
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                f"UPDATE items SET {', '.join(assignments)} WHERE id = %s",
                tuple(params),
            )
            connection.commit()
            return cursor.rowcount

    @staticmethod
    def delete_item(item_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
            connection.commit()
            return cursor.rowcount

    @staticmethod
    def search_items(
        names: list[str] | None = None,
        price_op: FilterOperator | None = None,
        price_value: float | None = None,
        stock_op: FilterOperator | None = None,
        stock_value: int | None = None,
    ) -> list[ItemRecord]:
        conditions: list[str] = []
        params: list[QueryParam] = []

        if names:
            name_conditions: str = " OR ".join(["name LIKE %s"] * len(names))
            conditions.append(f"({name_conditions})")
            params.extend([f"%{name}%" for name in names])

        if price_op is not None and price_value is not None:
            conditions.append(f"price_usd {OPERATOR_SQL[price_op]} %s")
            params.append(price_value)

        if stock_op is not None and stock_value is not None:
            conditions.append(f"stock_qty {OPERATOR_SQL[stock_op]} %s")
            params.append(stock_value)

        query = _ITEM_SELECT
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(query, tuple(params))
            return cast(list[ItemRecord], cursor.fetchall())

    @staticmethod
    def count_items() -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("SELECT COUNT(*) AS item_count FROM items")
            row = cursor.fetchone()
            if row is None:
                return 0
            return int(row["item_count"])

    @staticmethod
    def execute_seed(sql: str) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(sql)
            connection.commit()

    @staticmethod
    def backfill_image_urls(image_urls: dict[str, str]) -> None:
        if not image_urls:
            return
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.executemany(
                """
                UPDATE items
                SET image_url = %s
                WHERE name = %s
                  AND (image_url IS NULL OR image_url NOT LIKE '/pics/%%')
                """,
                [(url, name) for name, url in image_urls.items()],
            )
            connection.commit()
