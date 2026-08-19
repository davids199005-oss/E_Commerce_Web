from fastapi import APIRouter, Depends, status

from app.middleware.auth_middleware import get_current_user_id
from app.models.order_schema import (
    OrderDetailRecord,
    OrderItemQuantityUpdate,
    OrderItemRequest,
    OrderRecord,
)
from app.services.orders_service import OrdersService

router: APIRouter = APIRouter(prefix="/orders", tags=["Orders"])


@router.get(path="")
def get_orders(
    user_id: int = Depends(dependency=get_current_user_id),
) -> dict[str, list[OrderRecord] | str]:
    orders: list[OrderRecord] = OrdersService.get_user_orders(user_id)
    if not orders:
        return {"orders": [], "message": "You have no orders yet"}
    return {"orders": orders}


@router.post(path="/items", status_code=status.HTTP_201_CREATED)
def add_item(
    request: OrderItemRequest, user_id: int = Depends(dependency=get_current_user_id)
) -> dict[str, str | int]:
    order_id: int = OrdersService.add_item(user_id, request.item_id, request.quantity)
    return {"message": "Item added to order", "order_id": order_id}


@router.patch(path="/items/{item_id}")
def update_item_quantity(
    item_id: int,
    request: OrderItemQuantityUpdate,
    user_id: int = Depends(dependency=get_current_user_id),
) -> dict[str, str]:
    OrdersService.update_item_quantity(user_id, item_id, request.quantity)
    return {"message": "Item quantity updated"}


@router.delete(path="/items/{item_id}")
def remove_item(
    item_id: int, user_id: int = Depends(dependency=get_current_user_id)
) -> dict[str, str]:
    OrdersService.remove_item(user_id, item_id)
    return {"message": "Item removed from order"}


@router.delete(path="/active")
def delete_active_order(
    user_id: int = Depends(dependency=get_current_user_id),
) -> dict[str, str]:
    OrdersService.delete_active_order(user_id)
    return {"message": "Order deleted"}


@router.post(path="/purchase")
def purchase(user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    OrdersService.purchase(user_id)
    return {"message": "Order purchased successfully"}


@router.get(path="/{order_id}")
def get_order_details(
    order_id: int, user_id: int = Depends(dependency=get_current_user_id)
) -> OrderDetailRecord:
    return OrdersService.get_order_details(user_id, order_id)
