from app.config.config import settings
from mysql.connector import pooling

class ConnectionPool:
    def __init__(self) -> None:
        self.pool = pooling.MySQLConnectionPool(
            pool_name="db_dev_pool",
            pool_size=5,
            host=settings.MYSQL_HOST,
            port=settings.MYSQL_PORT,
            database=settings.MYSQL_DATABASE,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
        )

    def get_connection(self) -> pooling.PooledMySQLConnection:
        return self.pool.get_connection()


connection_pool = ConnectionPool()

class DatabaseConnection:
    def __enter__(self) -> pooling.PooledMySQLConnection:
        self.connection: pooling.PooledMySQLConnection = connection_pool.get_connection()
        return self.connection

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        if exc_type is not None:
            self.connection.rollback()
        self.connection.close()


def get_connection() -> DatabaseConnection:
    return DatabaseConnection()
