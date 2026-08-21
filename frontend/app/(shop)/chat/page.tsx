"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import {
  useGetChatUsageQuery,
  useSendChatMessageMutation,
} from "@/lib/features/chat/chatApi";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

interface ChatBubble {
  role: ChatRole;
  text: string;
}

function bubbleClass(role: ChatRole): string {
  switch (role) {
    case "user":
      return "ml-auto bg-primary text-primary-foreground";
    case "assistant":
      return "mr-auto bg-muted text-foreground";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

function ChatContent() {
  const { data: usage } = useGetChatUsageQuery();
  const [sendMessage, sendState] = useSendChatMessageMutation();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatBubble[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      return;
    }
    setDraft("");
    setMessages((current) => [...current, { role: "user", text }]);
    try {
      const result = await sendMessage({ message: text }).unwrap();
      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.answer },
      ]);
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Осталось запросов сегодня: {usage?.prompts_remaining ?? "—"}
      </p>
      <div className="rounded-xl bg-card shadow-sm ring-1 ring-border">
        <ScrollArea className="h-[28rem] p-4">
          <div className="grid gap-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Спросите, например: «Что купить для дома до 50 долларов?»
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6",
                    bubbleClass(message.role),
                  )}
                >
                  {message.text}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="flex gap-2 border-t border-border p-3"
        >
          <label htmlFor="chat-input" className="sr-only">
            Сообщение помощнику
          </label>
          <Textarea
            id="chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Напишите вопрос"
            className="min-h-11 resize-none text-sm"
          />
          <Button
            type="submit"
            size="xl"
            disabled={sendState.isLoading || usage?.prompts_remaining === 0}
          >
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <AuthGate>
      <PageContainer>
        <h1 className="mb-2 font-heading text-3xl font-semibold tracking-tight">
          Помощник
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Ассистент знает каталог и поможет выбрать товар
        </p>
        <ChatContent />
      </PageContainer>
    </AuthGate>
  );
}
