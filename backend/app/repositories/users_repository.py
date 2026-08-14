from app.db.connection import get_connection


class UsersRepository:
    @staticmethod
    def create_user(user: dict) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                """
                INSERT INTO users
                    (first_name, last_name, email, phone, country, city, username, password_hash)
                VALUES
                    (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    user["first_name"],
                    user["last_name"],
                    user["email"],
                    user["phone"],
                    user["country"],
                    user["city"],
                    user["username"],
                    user["password_hash"],
                ),
            )
            connection.commit()
            return cursor.lastrowid

    @staticmethod
    def get_by_username(username: str) -> dict | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT id, username, email, password_hash FROM users WHERE username = %s",
                (username,),
            )
            return cursor.fetchone()

    @staticmethod
    def exists_by_username_or_email(username: str, email: str) -> bool:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT id FROM users WHERE username = %s OR email = %s",
                (username, email),
            )
            return cursor.fetchone() is not None

    @staticmethod
    def get_by_id(user_id: int) -> dict | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                """
                SELECT id, username, email, first_name, last_name, phone, country, city, created_at
                FROM users WHERE id = %s
                """,
                (user_id,),
            )
            return cursor.fetchone()

    @staticmethod
    def delete_user(user_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            connection.commit()
            return cursor.rowcount
