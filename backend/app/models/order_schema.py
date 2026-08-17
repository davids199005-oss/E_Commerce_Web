from datetime import datetime
from decimal import Decimal
from typing import TypedDict

from pydantic import BaseModel, Field

# Pydantic models for request validation
class OrderItemRequest(BaseModel):
    item_id: int = Field(gt=0)
    quantity: int = Field(default=1, gt=0)

# Pydantic model for order record
class OrderRecord(TypedDict):
    id: int
    status: str
    shipping_country: str
    shipping_city: str
    total_price_usd: Decimal
    created_at: datetime
    closed_at: datetime | None
