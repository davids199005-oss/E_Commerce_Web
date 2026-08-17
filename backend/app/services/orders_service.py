from app.exceptions.app_exceptions import ConflictError, NotFoundError, ValidationError
from app.repositories.items_repository import ItemsRepository
from app.repositories.orders_repository import OrdersRepository
from app.repositories.users_repository import UsersRepository
from app.services.items_service import ItemsService

class OrdersService:
    @staticmethod
    def get_user_orders(user_id: int) -> list[dict]:
        return OrdersRepository.get_orders_by_user(user_id)

    @staticmethod
    def get_order_details(user_id: int, order_id: int) -> dict:
        order = OrdersRepository.get_order_by_id(order_id)
        if order is None or order["user_id"] != user_id:
            raise NotFoundError("Order not found")

        order["items"] = OrdersRepository.get_order_items(order_id)
        return order

    @staticmethod
    def add_item(user_id: int, item_id: int, quantity: int) -> int:
        if quantity < 1:
            raise ValidationError("Quantity must be at least 1")

        item = ItemsRepository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundError("Item not found")

        if item["stock_qty"] < quantity:
            raise ConflictError(
                f"Not enough stock for item '{item['name']}'. "
                f"Available: {item['stock_qty']}"
            )

        order_id = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            user = UsersRepository.get_by_id(user_id)
            order_id = OrdersRepository.create_temp_order(
                user_id, user["country"], user["city"]
            )

        OrdersRepository.add_item_to_order(
            order_id, item_id, quantity, item["price_usd"]
        )
        OrdersRepository.recalculate_order_total(order_id)
        return order_id

    @staticmethod
    def remove_item(user_id: int, item_id: int) -> None:
        order_id = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        removed_rows = OrdersRepository.remove_item_from_order(order_id, item_id)
        if removed_rows == 0:
            raise NotFoundError("Item is not in your order")

        if OrdersRepository.count_order_items(order_id) == 0:
            OrdersRepository.delete_order(order_id)
            return

        OrdersRepository.recalculate_order_total(order_id)

    @staticmethod
    def delete_active_order(user_id: int) -> None:
        order_id = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        OrdersRepository.delete_order(order_id)

    @staticmethod
    def purchase(user_id: int) -> None:
        order_id = OrdersRepository.get_active_order_id(user_id)
        if order_id is None:
            raise NotFoundError("You have no active order")

        OrdersRepository.purchase_order(order_id)
        ItemsService.delete_all_items_cache()
