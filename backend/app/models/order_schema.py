from datetime import datetime
from decimal import Decimal
from typing import TypedDict

from pydantic import BaseModel, Field


class OrderItemRequest(BaseModel):
    item_id: int = Field(gt=0)
    quantity: int = Field(default=1, gt=0)


class OrderRecord(TypedDict):
    id: int
    status: str
    shipping_country: str
    shipping_city: str
    total_price_usd: Decimal
    created_at: datetime
    closed_at: datetime | None


class OrderByIdRecord(OrderRecord):
    user_id: int


class OrderItemRecord(TypedDict):
    item_id: int
    name: str
    quantity: int
    unit_price: Decimal
    stock_qty: int


class OrderDetailRecord(OrderByIdRecord):
    items: list[OrderItemRecord]
