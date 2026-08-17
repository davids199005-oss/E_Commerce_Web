from fastapi import APIRouter, HTTPException, Query, status

from app.enums.filter_operator import FilterOperator
from app.services.items_service import ItemsService

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("")
def get_items(
        names: list[str] | None = Query(default=None),
        price_op: FilterOperator | None = Query(default=None),
        price_value: float | None = Query(default=None),
        stock_op: FilterOperator | None = Query(default=None),
        stock_value: int | None = Query(default=None),
) -> dict:
    has_filters = any(
        value is not None
        for value in (names, price_op, price_value, stock_op, stock_value)
    )

    try:
        items = (
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
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if not items:
        return {"items": [], "message": "No items found matching your search"}

    return {"items": items}
