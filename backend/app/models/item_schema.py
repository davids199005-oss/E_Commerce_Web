from decimal import Decimal
from typing import TypedDict


class ItemRecord(TypedDict):
    id: int
    name: str
    price_usd: Decimal
    stock_qty: int


class ItemWrite(TypedDict):
    name: str
    price_usd: Decimal
