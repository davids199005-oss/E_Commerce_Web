from typing import cast

from app.exceptions.app_exceptions import ConflictError, NotFoundError, ValidationError
from app.models.user_schema import (
    PasswordChange,
    UserAuthRecord,
    UserProfileWrite,
    UserRecord,
    UserUpdate,
)
from app.repositories.users_repository import UsersRepository
from app.utils.password_util import PasswordUtil


class UsersService:
    @staticmethod
    def get_profile(user_id: int) -> UserRecord:
        user: UserRecord | None = UsersRepository.get_by_id(user_id)
        if user is None:
            raise NotFoundError("User not found")
        return user

    @staticmethod
    def update_profile(user_id: int, user_data: UserUpdate) -> UserRecord:
        fields: UserProfileWrite = cast(
            UserProfileWrite, user_data.model_dump(exclude_unset=True)
        )
        if not fields:
            raise ValidationError("At least one field is required")

        current: UserRecord | None = UsersRepository.get_by_id(user_id)
        if current is None:
            raise NotFoundError("User not found")

        username: str = fields.get("username", current["username"])
        email: str = fields.get("email", current["email"])
        if ("username" in fields or "email" in fields) and UsersRepository.exists_by_username_or_email(
            username, email, exclude_user_id=user_id
        ):
            raise ConflictError("Username or email already exists")

        UsersRepository.update_user(user_id, user=fields)
        return UsersService.get_profile(user_id)

    @staticmethod
    def change_password(user_id: int, passwords: PasswordChange) -> None:
        user: UserAuthRecord | None = UsersRepository.get_auth_by_id(user_id)
        if user is None:
            raise NotFoundError("User not found")

        if not PasswordUtil.verify_password(
            plain_password=passwords.current_password,
            hashed_password=user["password_hash"],
        ):
            raise ValidationError("Current password is incorrect")

        if passwords.new_password == passwords.current_password:
            raise ValidationError("New password must be different from the current password")

        UsersRepository.update_password(
            user_id,
            password_hash=PasswordUtil.hash_password(
                plain_password=passwords.new_password
            ),
        )

    @staticmethod
    def delete_account(user_id: int) -> None:
        deleted_rows: int = UsersRepository.delete_user(user_id=user_id)
        if deleted_rows == 0:
            raise NotFoundError("User not found")
