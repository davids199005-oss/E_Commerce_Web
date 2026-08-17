from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter

from app.exceptions.app_exceptions import ConflictError, NotFoundError, ValidationError
from app.middleware.auth_middleware import get_current_user_id
from app.models.order_schema import OrderDetailRecord, OrderItemRequest, OrderRecord
from app.services.orders_service import OrdersService

router: APIRouter = APIRouter(prefix="/orders", tags=["Orders"])


@router.get(path="")
def get_orders(user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, list[OrderRecord] | str]:
    orders: list[OrderRecord] = OrdersService.get_user_orders(user_id)
    if not orders:
        return {"orders": [], "message": "You have no orders yet"}
    return {"orders": orders}


@router.post(path="/items", status_code=status.HTTP_201_CREATED)
def add_item(
        request: OrderItemRequest, user_id: int = Depends(dependency=get_current_user_id)
) -> dict[str, str | int]:
    try:
        order_id: int = OrdersService.add_item(user_id, request.item_id, request.quantity)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {"message": "Item added to order", "order_id": order_id}


@router.delete(path="/items/{item_id}")
def remove_item(item_id: int, user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    try:
        OrdersService.remove_item(user_id, item_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return {"message": "Item removed from order"}


@router.delete(path="/active")
def delete_active_order(user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    try:
        OrdersService.delete_active_order(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return {"message": "Order deleted"}


@router.post(path="/purchase")
def purchase(user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, str]:
    try:
        OrdersService.purchase(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {"message": "Order purchased successfully"}


@router.get(path="/{order_id}")
def get_order_details(
        order_id: int, user_id: int = Depends(dependency=get_current_user_id)
) -> OrderDetailRecord:
    try:
        return OrdersService.get_order_details(user_id, order_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
