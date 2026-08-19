from collections.abc import Sequence
from datetime import datetime
from pathlib import Path
from typing import Protocol, TypedDict, cast

import joblib  # pyright: ignore[reportMissingTypeStubs]
import pandas as pd

from app.config.config import PROJECT_ROOT
from app.exceptions.app_exceptions import NotFoundError, ServiceUnavailableError
from app.repositories.analytics_repository import AnalyticsRepository, ChurnFeaturesRaw

MODEL_PATH = PROJECT_ROOT / "ml" / "model" / "churn_model.joblib"


class _ChurnPipeline(Protocol):
    def predict_proba(self, x: pd.DataFrame) -> Sequence[Sequence[float]]: ...


class ChurnModel(TypedDict):
    pipeline: _ChurnPipeline
    feature_columns: list[str]


class _Joblib(Protocol):
    def load(self, filename: Path) -> ChurnModel: ...


class ChurnPrediction(TypedDict):
    user_id: int
    churn_probability: float
    will_churn: bool
    features: dict[str, float]


class ChurnService:
    _model: ChurnModel | None = None

    @classmethod
    def load_model(cls) -> None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Churn model not found at {MODEL_PATH}")
        loader: _Joblib = cast(_Joblib, joblib)
        cls._model = loader.load(MODEL_PATH)

    @staticmethod
    def _build_features(raw: ChurnFeaturesRaw) -> dict[str, float]:
        account_age_days: float = float(raw["account_age_days"])
        orders_count: float = float(raw["orders_count"])
        total_spent: float = float(raw["total_spent"])

        avg_order_value: float = total_spent / orders_count if orders_count > 0 else 0.0

        last_order_at = raw["last_order_at"]
        if last_order_at is None:
            days_since_last_order: float = account_age_days
        else:
            days_since_last_order = float((datetime.now() - last_order_at).days)
        days_since_last_order = min(days_since_last_order, account_age_days)

        return {
            "account_age_days": account_age_days,
            "orders_count": orders_count,
            "total_spent": total_spent,
            "avg_order_value": avg_order_value,
            "days_since_last_order": days_since_last_order,
            "favorites_count": float(raw["favorites_count"]),
        }

    @classmethod
    def predict(cls, user_id: int) -> ChurnPrediction:
        if cls._model is None:
            raise ServiceUnavailableError("Churn model is not available")

        raw: ChurnFeaturesRaw | None = AnalyticsRepository.get_churn_features(user_id)
        if raw is None:
            raise NotFoundError("User not found")

        features: dict[str, float] = cls._build_features(raw)
        frame = pd.DataFrame([features], columns=cls._model["feature_columns"])
        probability: float = float(cls._model["pipeline"].predict_proba(frame)[0][1])

        return {
            "user_id": user_id,
            "churn_probability": round(probability, 4),
            "will_churn": probability >= 0.5,
            "features": features,
        }