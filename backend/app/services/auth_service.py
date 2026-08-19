from app.exceptions.app_exceptions import ConflictError
from app.models.user_schema import UserAuthRecord, UserCreate, UserWrite
from app.repositories.users_repository import UsersRepository
from app.utils.jwt_util import JwtUtil
from app.utils.password_util import PasswordUtil


class AuthService:
    @staticmethod
    def register(user_data: UserCreate) -> int:
        if UsersRepository.exists_by_username_or_email(
            user_data.username, user_data.email
        ):
            raise ConflictError("Username or email already exists")

        user_record: UserWrite = {
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "email": user_data.email,
            "phone": user_data.phone,
            "country": user_data.country,
            "city": user_data.city,
            "username": user_data.username,
            "password_hash": PasswordUtil.hash_password(
                plain_password=user_data.password
            ),
        }
        return UsersRepository.create_user(user=user_record)

    @staticmethod
    def login(username: str, password: str) -> str | None:
        user: UserAuthRecord | None = UsersRepository.get_by_username(username)
        if user is None:
            return None
        if not PasswordUtil.verify_password(
            plain_password=password, hashed_password=user["password_hash"]
        ):
            return None
        return JwtUtil.create_token(user_id=user["id"])
