from typing import cast

from app.db.connection import get_connection
from app.models.user_schema import UserAuthRecord, UserRecord, UserWrite


class UsersRepository:
    @staticmethod
    def create_user(user: UserWrite) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        INSERT INTO users
                        (first_name, last_name, email, phone, country, city, username, password_hash)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
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
            inserted_id: int | None = cursor.lastrowid
            if inserted_id is None:
                raise RuntimeError("Insert did not return an id")
            return inserted_id

    @staticmethod
    def get_by_username(username: str) -> UserAuthRecord | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                "SELECT id, username, email, password_hash FROM users WHERE username = %s",
                (username,),
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return cast(UserAuthRecord, row)

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
    def get_by_id(user_id: int) -> UserRecord | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                        """
                        SELECT id,
                               username,
                               email,
                               first_name,
                               last_name,
                               phone,
                               country,
                               city,
                               created_at
                        FROM users
                        WHERE id = %s
                        """,
                (user_id,),
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return cast(UserRecord, row)

    @staticmethod
    def delete_user(user_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            connection.commit()
            return cursor.rowcount
