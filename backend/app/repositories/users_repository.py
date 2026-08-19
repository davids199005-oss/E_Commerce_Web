from typing import cast

from app.db.connection import get_connection
from app.models.user_schema import (
    UserAuthRecord,
    UserProfileWrite,
    UserRecord,
    UserWrite,
)

_USER_PATCH_COLUMNS: frozenset[str] = frozenset(
    {
        "first_name",
        "last_name",
        "email",
        "phone",
        "country",
        "city",
        "username",
    }
)


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
    def exists_by_username_or_email(
            username: str, email: str, exclude_user_id: int | None = None
    ) -> bool:
        query: str = "SELECT id FROM users WHERE (username = %s OR email = %s)"
        params: tuple[str, str] | tuple[str, str, int] = (username, email)
        if exclude_user_id is not None:
            query += " AND id != %s"
            params = (username, email, exclude_user_id)

        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(query, params)
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
    def is_admin(user_id: int) -> bool:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("SELECT is_admin FROM users WHERE id = %s", (user_id,))
            row = cursor.fetchone()
            return bool(row["is_admin"]) if row is not None else False

    @staticmethod
    def update_user(user_id: int, user: UserProfileWrite) -> int:
        if not user:
            return 0

        assignments: list[str] = [
            f"{column} = %s" for column in user if column in _USER_PATCH_COLUMNS
        ]
        if not assignments:
            return 0
        params: list[str | int] = [
            user[column] for column in user if column in _USER_PATCH_COLUMNS
        ]
        params.append(user_id)
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                f"UPDATE users SET {', '.join(assignments)} WHERE id = %s",
                tuple(params),
            )
            connection.commit()
            return cursor.rowcount

    @staticmethod
    def delete_user(user_id: int) -> int:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            connection.commit()
            return cursor.rowcount
