from decimal import Decimal
from typing import Any, cast

from app.db.connection import get_connection
from app.enums.order_status import OrderStatus
from app.exceptions.app_exceptions import ConflictError, ValidationError
from app.models.order_schema import OrderByIdRecord, OrderItemRecord, OrderRecord


class OrdersRepository:
    @staticmethod
    def get_active_order_id(user_id: int) -> int | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT order_id FROM user_active_orders WHERE user_id = %s",
                (user_id,),
            )
            row = cursor.fetchone()
            return row["order_id"] if row else None

    @staticmethod
    def create_temp_order(user_id: int, country: str, city: str) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        INSERT INTO orders
                            (user_id, shipping_country, shipping_city, total_price_usd, status)
                        VALUES (%s, %s, %s, 0, %s)
                        """,
                (user_id, country, city, OrderStatus.TEMP.value),
            )
            order_id: int | None = cursor.lastrowid
            if order_id is None:
                raise RuntimeError("Insert did not return an id")

            cursor.execute(
                "INSERT INTO user_active_orders (user_id, order_id) VALUES (%s, %s)",
                (user_id, order_id),
            )
            connection.commit()
            return order_id

    @staticmethod
    def get_order_by_id(order_id: int) -> OrderByIdRecord | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        SELECT id,
                               user_id,
                               status,
                               shipping_country,
                               shipping_city,
                               total_price_usd,
                               created_at,
                               closed_at
                        FROM orders
                        WHERE id = %s
                        """,
                (order_id,),
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return cast(OrderByIdRecord, row)

    @staticmethod
    def get_orders_by_user(user_id: int) -> list[OrderRecord]:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        SELECT id,
                               status,
                               shipping_country,
                               shipping_city,
                               total_price_usd,
                               created_at,
                               closed_at
                        FROM orders
                        WHERE user_id = %s
                        ORDER BY (status = %s) DESC, created_at DESC
                        """,
                (user_id, OrderStatus.TEMP.value),
            )
            return cast(list[OrderRecord], cursor.fetchall())

    @staticmethod
    def get_order_items(order_id: int) -> list[OrderItemRecord]:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        SELECT items.id AS item_id,
                               items.name,
                               order_items.quantity,
                               order_items.unit_usd AS unit_price,
                               items.stock_qty,
                               items.image_url
                        FROM order_items
                                 JOIN items ON order_items.item_id = items.id
                        WHERE order_items.order_id = %s
                        """,
                (order_id,),
            )
            return cast(list[OrderItemRecord], cursor.fetchall())

    @staticmethod
    def add_item_to_order(
            order_id: int, item_id: int, quantity: int, unit_price: Decimal
    ) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        INSERT INTO order_items (order_id, item_id, quantity, unit_usd)
                            VALUES (%s, %s, %s, %s) AS new
                        ON DUPLICATE KEY UPDATE quantity = order_items.quantity + new.quantity
                        """,
                (order_id, item_id, quantity, unit_price),
            )
            connection.commit()

    @staticmethod
    def set_item_quantity(order_id: int, item_id: int, quantity: int) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                """
                UPDATE order_items
                SET quantity = %s
                WHERE order_id = %s
                  AND item_id = %s
                """,
                (quantity, order_id, item_id),
            )
            connection.commit()

    @staticmethod
    def remove_item_from_order(order_id: int, item_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "DELETE FROM order_items WHERE order_id = %s AND item_id = %s",
                (order_id, item_id),
            )
            connection.commit()
            return cursor.rowcount

    @staticmethod
    def count_order_items(order_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT COUNT(*) AS item_count FROM order_items WHERE order_id = %s",
                (order_id,),
            )
            row: dict[str, Any] | None = cursor.fetchone()
            if row is None:
                raise RuntimeError("Select did not return a row")
            return cast(int, row["item_count"])

    @staticmethod
    def delete_order(order_id: int) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("DELETE FROM orders WHERE id = %s", (order_id,))
            connection.commit()

    @staticmethod
    def recalculate_order_total(order_id: int) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        UPDATE orders
                        SET total_price_usd = (SELECT COALESCE(SUM(quantity * unit_usd), 0)
                                               FROM order_items
                                               WHERE order_id = %s)
                        WHERE id = %s
                        """,
                (order_id, order_id),
            )
            connection.commit()

    @staticmethod
    def purchase_order(order_id: int) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        SELECT order_items.item_id, order_items.quantity, items.name
                        FROM order_items
                                 JOIN items ON order_items.item_id = items.id
                        WHERE order_items.order_id = %s
                        ORDER BY order_items.item_id
                        """,
                (order_id,),
            )
            order_items = cursor.fetchall()

            if not order_items:
                raise ValidationError("Cannot purchase an empty order")

            for order_item in order_items:
                cursor.execute(
                            """
                            UPDATE items
                            SET stock_qty = stock_qty - %s
                            WHERE id = %s
                              AND stock_qty >= %s
                            """,
                    (
                        order_item["quantity"],
                        order_item["item_id"],
                        order_item["quantity"],
                    ),
                )
                if cursor.rowcount == 0:
                    raise ConflictError(
                        f"Not enough stock for item '{order_item['name']}'"
                    )

            cursor.execute(
                "UPDATE orders SET status = %s, closed_at = CURRENT_TIMESTAMP WHERE id = %s",
                (OrderStatus.CLOSED.value, order_id),
            )
            cursor.execute(
                "DELETE FROM user_active_orders WHERE order_id = %s",
                (order_id,),
            )
            connection.commit()

    @staticmethod
    def get_item_quantity_in_order(order_id: int, item_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT quantity FROM order_items WHERE order_id = %s AND item_id = %s",
                (order_id, item_id),
            )
            row = cursor.fetchone()
            return row["quantity"] if row else 0
