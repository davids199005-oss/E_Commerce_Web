from fastapi import APIRouter, Depends, Query, status

from app.enums.filter_operator import FilterOperator
from app.middleware.auth_middleware import require_admin
from app.models.item_schema import ItemCreate, ItemRecord, ItemUpdate
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


@router.get(path="/{item_id}")
def get_item(item_id: int) -> ItemRecord:
    return ItemsService.get_item_by_id(item_id)


@router.post(
    path="",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(dependency=require_admin)],
)
def create_item(item: ItemCreate) -> dict[str, str | int]:
    item_id: int = ItemsService.add_item(item)
    return {"message": "Item created successfully", "item_id": item_id}


@router.patch(
    path="/{item_id}",
    dependencies=[Depends(dependency=require_admin)],
)
def update_item(item_id: int, item: ItemUpdate) -> dict[str, str]:
    ItemsService.update_item(item_id, item)
    return {"message": "Item updated successfully"}


@router.delete(
    path="/{item_id}",
    dependencies=[Depends(dependency=require_admin)],
)
def delete_item(item_id: int) -> dict[str, str]:
    ItemsService.delete_item(item_id)
    return {"message": "Item deleted successfully"}
