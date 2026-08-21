"use client";

import { useState } from "react";
import { toast } from "sonner";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import { useLazyGetChurnPredictionQuery } from "@/lib/features/analytics/analyticsApi";
import { useListUsersQuery } from "@/lib/features/users/usersApi";

export default function AdminAnalyticsPage() {
  const { data } = useListUsersQuery();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [getChurn, churnState] = useLazyGetChurnPredictionQuery();
  const users = data?.users ?? [];
  const prediction = churnState.data;

  async function handlePredict(): Promise<void> {
    const userId = Number(selectedUserId);
    if (!Number.isFinite(userId) || userId < 1) {
      toast.error("Выберите пользователя");
      return;
    }
    try {
      await getChurn(userId).unwrap();
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <PageContainer>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Аналитика оттока
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Прогноз вероятности, что пользователь перестанет покупать
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border sm:flex-row sm:items-end">
        <div className="grid min-w-0 flex-1 gap-2">
          <span className="text-sm font-medium">Пользователь</span>
          <Select
            value={selectedUserId || null}
            onValueChange={(value) => {
              if (typeof value === "string") {
                setSelectedUserId(value);
              }
            }}
          >
            <SelectTrigger className="h-11 w-full text-sm">
              <SelectValue placeholder="Выберите пользователя" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  #{user.id} · {user.username} · {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="xl"
          disabled={churnState.isFetching}
          onClick={() => {
            void handlePredict();
          }}
        >
          Рассчитать
        </Button>
      </div>

      {prediction ? (
        <div className="mt-6 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
          <p className="text-sm text-muted-foreground">
            Пользователь #{prediction.user_id}
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold">
            {(prediction.churn_probability * 100).toFixed(1)}%
          </p>
          <p className="mt-2 text-sm font-medium">
            {prediction.will_churn
              ? "Высокий риск оттока"
              : "Отток маловероятен"}
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            {Object.entries(prediction.features).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </PageContainer>
  );
}
