from typing import cast

from app.db.connection import get_connection
from app.models.item_schema import ItemRecord


class FavoritesRepository:
    @staticmethod
    def get_favorites_by_user(user_id: int) -> list[ItemRecord]:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        SELECT items.id, items.name, items.price_usd, items.stock_qty
                        FROM favorites
                                 JOIN items ON favorites.item_id = items.id
                        WHERE favorites.user_id = %s
                        """,
                (user_id,),
            )
            return cast(list[ItemRecord], cursor.fetchall())

    @staticmethod
    def is_favorite(user_id: int, item_id: int) -> bool:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT 1 FROM favorites WHERE user_id = %s AND item_id = %s",
                (user_id, item_id),
            )
            return cursor.fetchone() is not None

    @staticmethod
    def add_favorite(user_id: int, item_id: int) -> None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "INSERT INTO favorites (user_id, item_id) VALUES (%s, %s)",
                (user_id, item_id),
            )
            connection.commit()

    @staticmethod
    def remove_favorite(user_id: int, item_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "DELETE FROM favorites WHERE user_id = %s AND item_id = %s",
                (user_id, item_id),
            )
            connection.commit()
            return cursor.rowcount
