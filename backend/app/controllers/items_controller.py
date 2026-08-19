from fastapi import APIRouter, Query

from app.enums.filter_operator import FilterOperator
from app.models.item_schema import ItemRecord
from app.services.items_service import ItemsService

router: APIRouter = APIRouter(prefix="/items", tags=["Items"])


@router.get(path="")
def get_items(
        names: list[str] | None = Query(default=None),
        price_op: FilterOperator | None = Query(default=None),
        price_value: float | None = Query(default=None),
        stock_op: FilterOperator | None = Query(default=None),
        stock_value: int | None = Query(default=None),
) -> dict[str, list[ItemRecord] | str]:
    has_filters: bool = any(
        value is not None
        for value in (names, price_op, price_value, stock_op, stock_value)
    )

    items: list[ItemRecord] = (
        ItemsService.search_items(
            names=names,
            price_op=price_op,
            price_value=price_value,
            stock_op=stock_op,
            stock_value=stock_value,
        )
        if has_filters
        else ItemsService.get_all_items()
    )

    if not items:
        return {"items": [], "message": "No items found matching your search"}

    return {"items": items}
