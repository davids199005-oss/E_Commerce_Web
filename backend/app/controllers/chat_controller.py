from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import get_current_user_id
from app.models.chat_schema import ChatRequest
from app.services.chat_limit_service import MAX_PROMPTS_PER_DAY, ChatLimitService
from app.services.chat_service import ChatService

router: APIRouter = APIRouter(prefix="/chat", tags=["Chat"])


@router.post(path="/message")
def send_message(
        request: ChatRequest, user_id: int = Depends(dependency=get_current_user_id)
) -> dict[str, str | int]:
    return ChatService.ask(user_id, request.message)


@router.get(path="/usage")
def get_usage(user_id: int = Depends(dependency=get_current_user_id)) -> dict[str, int]:
    used: int = ChatLimitService.get_used_prompts(user_id)
    return {
        "prompts_used": min(used, MAX_PROMPTS_PER_DAY),
        "prompts_remaining": max(MAX_PROMPTS_PER_DAY - used, 0),
    }
