from app.db.connection import get_connection
from app.enums.filter_operator import FilterOperator


class ItemsRepository:
    OPERATOR_SQL: dict[FilterOperator, str] = {
        FilterOperator.LT: "<",
        FilterOperator.GT: ">",
        FilterOperator.EQ: "=",
    }

    @staticmethod
    def get_all_items() -> list[dict]:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("SELECT id, name, price_usd, stock_qty FROM items")
            return cursor.fetchall()

    @staticmethod
    def get_item_by_id(item_id: int) -> dict | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT id, name, price_usd, stock_qty FROM items WHERE id = %s",
                (item_id,),
            )
            return cursor.fetchone()

    @staticmethod
    def create_item(item: dict) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "INSERT INTO items (name, price_usd) VALUES (%s, %s)",
                (item["name"], item["price_usd"]),
            )
            connection.commit()
            return cursor.lastrowid

    @staticmethod
    def update_item(item_id: int, item: dict) -> int:
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
    ) -> list[dict]:
        conditions: list[str] = []
        params: list = []

        if names:
            name_conditions = " OR ".join(["name LIKE %s"] * len(names))
            conditions.append(f"({name_conditions})")
            params.extend([f"%{name}%" for name in names])

        if price_op is not None and price_value is not None:
            conditions.append(f"price_usd {ItemsRepository.OPERATOR_SQL[price_op]} %s")
            params.append(price_value)

        if stock_op is not None and stock_value is not None:
            conditions.append(f"stock_qty {ItemsRepository.OPERATOR_SQL[stock_op]} %s")
            params.append(stock_value)

        query = "SELECT id, name, price_usd, stock_qty FROM items"
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(query, tuple(params))
            return cursor.fetchall()
