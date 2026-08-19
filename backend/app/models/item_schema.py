from decimal import Decimal
from typing import TypedDict

from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    price_usd: Decimal = Field(ge=0)
    stock_qty: int = Field(default=0, ge=0)


class ItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    price_usd: Decimal | None = Field(default=None, ge=0)
    stock_qty: int | None = Field(default=None, ge=0)


class ItemRecord(TypedDict):
    id: int
    name: str
    price_usd: Decimal
    stock_qty: int


class ItemWrite(TypedDict):
    name: str
    price_usd: Decimal
    stock_qty: int


class ItemPatch(TypedDict, total=False):
    name: str
    price_usd: Decimal
    stock_qty: int
