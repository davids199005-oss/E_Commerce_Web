from pydantic import BaseModel, Field


class OrderItemRequest(BaseModel):
    item_id: int = Field(gt=0)
    quantity: int = Field(default=1, gt=0)
