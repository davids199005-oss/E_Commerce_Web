from typing import TypeAlias, cast

from app.db.connection import get_connection
from app.enums.filter_operator import FilterOperator
from app.enums.operator_sql import OPERATOR_SQL
from app.models.item_schema import ItemRecord, ItemWrite

QueryParam: TypeAlias = str | float | int


class ItemsRepository:
    @staticmethod
    def get_all_items() -> list[ItemRecord]:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("SELECT id, name, price_usd, stock_qty FROM items")
            return cast(list[ItemRecord], cursor.fetchall())

    @staticmethod
    def get_item_by_id(item_id: int) -> ItemRecord | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT id, name, price_usd, stock_qty FROM items WHERE id = %s",
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
                "INSERT INTO items (name, price_usd) VALUES (%s, %s)",
                (item["name"], item["price_usd"]),
            )
            connection.commit()
            inserted_id: int | None = cursor.lastrowid
            if inserted_id is None:
                raise RuntimeError("Insert did not return an id")
            return inserted_id

    @staticmethod
    def update_item(item_id: int, item: ItemWrite) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "UPDATE items SET name = %s, price_usd = %s WHERE id = %s",
                (item["name"], item["price_usd"], item_id),
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

        query = "SELECT id, name, price_usd, stock_qty FROM items"
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(query, tuple(params))
            return cast(list[ItemRecord], cursor.fetchall())
