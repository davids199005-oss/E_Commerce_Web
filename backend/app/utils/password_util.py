import bcrypt


class PasswordUtil:
    @staticmethod
    def hash_password(plain_password: str) -> str:
        password_bytes: bytes = plain_password.encode(encoding="utf-8")
        salt: bytes = bcrypt.gensalt()
        hashed_bytes: bytes = bcrypt.hashpw(password=password_bytes, salt=salt)
        return hashed_bytes.decode(encoding="utf-8")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        password_bytes: bytes = plain_password.encode(encoding="utf-8")
        hashed_password_bytes: bytes = hashed_password.encode(encoding="utf-8")
        return bcrypt.checkpw(password=password_bytes, hashed_password=hashed_password_bytes)
