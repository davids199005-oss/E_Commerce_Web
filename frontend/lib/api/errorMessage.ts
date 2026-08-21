export function getErrorMessage(error: object): string {
  if ("status" in error) {
    const data = "data" in error ? error.data : undefined;
    if (typeof data === "string" && data.length > 0) {
      return data;
    }
    if (typeof data === "object" && data !== null && "detail" in data) {
      const detail = data.detail;
      if (typeof detail === "string" && detail.length > 0) {
        return detail;
      }
      if (Array.isArray(detail)) {
        const messages = detail.flatMap((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            "msg" in item &&
            typeof item.msg === "string"
          ) {
            return [item.msg];
          }
          return [];
        });
        if (messages.length > 0) {
          return messages.join(". ");
        }
      }
    }
    if (error.status === 401) {
      return "Неверный логин или пароль";
    }
  }

  if (
    "message" in error &&
    typeof error.message === "string" &&
    error.message.length > 0
  ) {
    return error.message;
  }

  return "Не удалось выполнить запрос";
}

export function getThrownErrorMessage(caught: unknown): string {
  if (typeof caught === "object" && caught !== null) {
    return getErrorMessage(caught);
  }
  return "Не удалось выполнить запрос";
}

export function isHttpStatus(error: object, status: number): boolean {
  return "status" in error && error.status === status;
}
