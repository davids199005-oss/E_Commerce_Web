from app.exceptions.app_exceptions import ConflictError, NotFoundError, ValidationError
from app.models.item_schema import ItemRecord
from app.models.order_schema import OrderByIdRecord, OrderDetailRecord, OrderRecord
from app.models.user_schema import UserRecord
from app.repositories.items_repository import ItemsRepository
from app.repositories.orders_repository import OrdersRepository
from app.repositories.users_repository import UsersRepository
from app.services.items_service import ItemsService


class OrdersService:
    @staticmethod
    def get_user_orders(user_id: int) -> list[OrderRecord]:
        return OrdersRepository.get_orders_by_user(user_id)

    @staticmethod
    def get_order_details(user_id: int, order_id: int) -> OrderDetailRecord:
        order: OrderByIdRecord | None = OrdersRepository.get_order_by_id(order_id)
        if order is None or order["user_id"] != user_id:
            raise NotFoundError("Order not found")

        return OrderDetailRecord(
            id=order["id"],
            user_id=order["user_id"],
            status=order["status"],
            shipping_country=order["shipping_country"],
            shipping_city=order["shipping_city"],
            total_price_usd=order["total_price_usd"],
            created_at=order["created_at"],
            closed_at=order["closed_at"],
            items=OrdersRepository.get_order_items(order_id),
        )

    @staticmethod
    def add_item(user_id: int, item_id: int, quantity: int) -> int:
        if quantity < 1:
            raise ValidationError("Quantity must be at least 1")

        item: ItemRecord | None = ItemsRepository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundError("Item not found")

        order_id: int | None = OrdersRepository.get_active_order_id(user_id)

        quantity_in_order: int = (
            OrdersRepository.get_item_quantity_in_order(order_id, item_id)
            if order_id is not None
            else 0
        )

        if quantity_in_order + quantity > item["stock_qty"]:
            raise ConflictError(
                f"Not enough stock for item '{item['name']}'. "
                f"Available: {item['stock_qty']}, already in your order: {quantity_in_order}"
            )

        if order_id is None:
            user: UserRecord | None = UsersRepository.get_by_id(user_id)
            if user is None:
                raise NotFoundError("User not found")
            order_id = OrdersRepository.create_temp_order(
                user_id, country=user["country"], city=user["city"]
            )

        OrdersRepository.add_item_to_order(
            order_id, item_id, quantity, unit_price=item["price_usd"]
        )
        OrdersRepository.recalculate_order_total(order_id)
        return order_id

    @staticmethod
    def update_item_quantity(user_id: int, item_id: int, quantity: int) -> None:
        order_id: int | None = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        quantity_in_order: int = OrdersRepository.get_item_quantity_in_order(
            order_id, item_id
        )
        if quantity_in_order == 0:
            raise NotFoundError("Item is not in your order")

        item: ItemRecord | None = ItemsRepository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundError("Item not found")

        if quantity > item["stock_qty"]:
            raise ConflictError(
                f"Not enough stock for item '{item['name']}'. "
                f"Available: {item['stock_qty']}"
            )

        OrdersRepository.set_item_quantity(order_id, item_id, quantity)
        OrdersRepository.recalculate_order_total(order_id)

    @staticmethod
    def remove_item(user_id: int, item_id: int) -> None:
        order_id: int | None = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        removed_rows: int = OrdersRepository.remove_item_from_order(order_id, item_id)
        if removed_rows == 0:
            raise NotFoundError("Item is not in your order")

        if OrdersRepository.count_order_items(order_id) == 0:
            OrdersRepository.delete_order(order_id)
            return

        OrdersRepository.recalculate_order_total(order_id)

    @staticmethod
    def delete_active_order(user_id: int) -> None:
        order_id: int | None = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        OrdersRepository.delete_order(order_id)

    @staticmethod
    def purchase(user_id: int) -> None:
        order_id: int | None = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        OrdersRepository.purchase_order(order_id)
        ItemsService.delete_all_items_cache()
