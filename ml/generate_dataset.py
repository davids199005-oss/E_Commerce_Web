from pathlib import Path

import numpy as np
import pandas as pd

RANDOM_SEED = 42
USERS_COUNT = 3000
OUTPUT_PATH = Path(__file__).resolve().parent / "data" / "synthetic_users.csv"


def generate_dataset(users_count: int, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    account_age_days = rng.integers(low=1, high=1095, size=users_count)
    orders_count = rng.poisson(lam=4, size=users_count)
    favorites_count = rng.poisson(lam=3, size=users_count)

    avg_order_value = np.round(rng.gamma(shape=3.0, scale=25.0, size=users_count), 2)
    total_spent = np.round(avg_order_value * orders_count, 2)

    days_since_last_order = np.where(
        orders_count == 0,
        account_age_days,
        rng.integers(low=1, high=181, size=users_count),
    )
    days_since_last_order = np.minimum(days_since_last_order, account_age_days)

    churn_score = (
        0.030 * days_since_last_order
        - 0.220 * orders_count
        - 0.090 * favorites_count
        - 0.004 * total_spent
        + 0.001 * account_age_days
        - 1.10
    )
    churn_probability = 1 / (1 + np.exp(-churn_score))
    churned = (rng.random(users_count) < churn_probability).astype(int)

    return pd.DataFrame(
        {
            "account_age_days": account_age_days,
            "orders_count": orders_count,
            "total_spent": total_spent,
            "avg_order_value": avg_order_value,
            "days_since_last_order": days_since_last_order,
            "favorites_count": favorites_count,
            "churned": churned,
        }
    )


def main() -> None:
    dataset = generate_dataset(users_count=USERS_COUNT, seed=RANDOM_SEED)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    dataset.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(dataset)} rows to {OUTPUT_PATH}")
    print(dataset["churned"].value_counts(normalize=True))


if __name__ == "__main__":
    main()