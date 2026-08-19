from datetime import datetime
from decimal import Decimal
from typing import TypedDict, cast

from app.db.connection import get_connection
from app.enums.order_status import OrderStatus


class ChurnFeaturesRaw(TypedDict):
    account_age_days: int
    orders_count: int
    total_spent: Decimal
    favorites_count: int
    last_order_at: datetime | None


class AnalyticsRepository:
    @staticmethod
    def get_churn_features(user_id: int) -> ChurnFeaturesRaw | None:
        with (
            get_connection() as connection,
            connection.cursor(dictionary=True) as cursor,
        ):
            cursor.execute(
                """
                SELECT
                    DATEDIFF(CURRENT_DATE, DATE(users.created_at)) AS account_age_days,
                    (SELECT COUNT(*)
                       FROM orders
                      WHERE orders.user_id = users.id
                        AND orders.status = %s)                    AS orders_count,
                    (SELECT COALESCE(SUM(orders.total_price_usd), 0)
                       FROM orders
                      WHERE orders.user_id = users.id
                        AND orders.status = %s)                    AS total_spent,
                    (SELECT COUNT(*)
                       FROM favorites
                      WHERE favorites.user_id = users.id)          AS favorites_count,
                    (SELECT MAX(orders.closed_at)
                       FROM orders
                      WHERE orders.user_id = users.id
                        AND orders.status = %s)                    AS last_order_at
                FROM users
                WHERE users.id = %s
                """,
                (
                    OrderStatus.CLOSED.value,
                    OrderStatus.CLOSED.value,
                    OrderStatus.CLOSED.value,
                    user_id,
                ),
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return cast(ChurnFeaturesRaw, row)