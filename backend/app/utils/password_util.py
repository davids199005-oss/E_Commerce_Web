import bcrypt


class PasswordUtil:
  @staticmethod
  def hash_password(plain_password: str) -> str:
    password_bytes: bytes = plain_password.encode('utf-8')
    salt: bytes = bcrypt.gensalt()
    hashed_bytes: bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

  @staticmethod
  def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes: bytes = plain_password.encode('utf-8')
    hashed_password_bytes: bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_password_bytes)


