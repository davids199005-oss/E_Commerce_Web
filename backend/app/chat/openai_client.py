from openai import OpenAI, OpenAIError
from openai.types.responses.response import Response

from app.config.config import settings
from app.exceptions.app_exceptions import ServiceUnavailableError


class OpenAIClient:
    def __init__(self) -> None:
        self.client: OpenAI = OpenAI(api_key=settings.OPENAI_API_KEY)

    def ask(self, instructions: str, user_message: str) -> str:
        try:
            response: Response = self.client.responses.create(
                model=settings.OPENAI_MODEL,
                instructions=instructions,
                input=user_message,
            )
        except OpenAIError as error:
            raise ServiceUnavailableError(
                "Chat assistant is not available right now"
            ) from error
        return response.output_text


openai_client: OpenAIClient = OpenAIClient()