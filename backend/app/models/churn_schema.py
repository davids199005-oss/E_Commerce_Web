from collections.abc import Sequence
from datetime import datetime
from decimal import Decimal
from typing import Protocol, TypedDict


class _ChurnPipeline(Protocol):
    def predict_proba(self, X: object) -> Sequence[Sequence[float]]: ...


class ChurnModel(TypedDict):
    pipeline: _ChurnPipeline
    feature_columns: list[str]


class ChurnFeaturesRaw(TypedDict):
    account_age_days: int
    orders_count: int
    total_spent: Decimal
    favorites_count: int
    last_order_at: datetime | None


class ChurnPrediction(TypedDict):
    user_id: int
    churn_probability: float
    will_churn: bool
    features: dict[str, float]
