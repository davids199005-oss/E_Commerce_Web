from app.db.connection import get_connection


class ItemsRepository:
    @staticmethod
    def get_all_items() -> list[dict]:
        with get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT id, name, price_usd, stock_qty FROM items")
                return cursor.fetchall()

    @staticmethod
    def get_item_by_id(item_id: int) -> dict | None:
        with get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "SELECT id, name, price_usd, stock_qty FROM items WHERE id = %s",
                    (item_id,),
                )
                return cursor.fetchone()

    @staticmethod
    def create_item(item: dict) -> int:
        with get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "INSERT INTO items (name, price_usd) VALUES (%s, %s)",
                    (item["name"], item["price_usd"]),
                )
                connection.commit()
                return cursor.lastrowid

    @staticmethod
    def update_item(item_id: int, item: dict) -> int:
        with get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "UPDATE items SET name = %s, price_usd = %s WHERE id = %s",
                    (item["name"], item["price_usd"], item_id),
                )
                connection.commit()
                return cursor.rowcount

    @staticmethod
    def delete_item(item_id: int) -> int:
        with get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
                connection.commit()
                return cursor.rowcount
