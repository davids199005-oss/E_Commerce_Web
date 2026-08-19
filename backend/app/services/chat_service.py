from app.chat.assistant_role import ASSISTANT_ROLE
from app.chat.openai_client import openai_client
from app.config.config import settings
from app.exceptions.app_exceptions import ServiceUnavailableError
from app.models.item_schema import ItemRecord
from app.services.chat_limit_service import ChatLimitService
from app.services.items_service import ItemsService


class ChatService:
    @staticmethod
    def _format_item(item: ItemRecord) -> str:
        if item["stock_qty"] == 0:
            availability: str = "out of stock"
        else:
            availability = f"{item['stock_qty']} in stock"
        return f"- {item['name']}: ${item['price_usd']} ({availability})"

    @staticmethod
    def _build_instructions() -> str:
        items: list[ItemRecord] = ItemsService.get_all_items()
        catalog: str = "\n".join(ChatService._format_item(item) for item in items)
        return f"{ASSISTANT_ROLE}\n\nStore catalog:\n{catalog}"

    @staticmethod
    def ask(user_id: int, message: str) -> dict[str, str | int]:
        instructions: str = ChatService._build_instructions()
        used: int = ChatLimitService.consume_prompt(user_id)
        try:
            answer: str = openai_client.ask(
                instructions=instructions, user_message=message
            )
        except ServiceUnavailableError:
            ChatLimitService.refund_prompt(user_id)
            raise

        return {
            "answer": answer,
            "prompts_used": used,
            "prompts_remaining": settings.MAX_PROMPTS_PER_DAY - used,
        }
