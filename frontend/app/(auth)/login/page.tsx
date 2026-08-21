"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { tokenReceived } from "@/lib/features/auth/authSlice";
import { authStorage } from "@/lib/features/auth/authStorage";
import { useAppDispatch } from "@/lib/hooks/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, loginState] = useLoginMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      const result = await login({ username, password }).unwrap();
      authStorage.write(result.token);
      dispatch(tokenReceived(result.token));
      router.push("/");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="w-full max-w-md rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border"
    >
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Вход
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
      <div className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Логин</Label>
          <Input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="h-11 text-sm md:text-sm"
            autoComplete="username"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 text-sm md:text-sm"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" size="xl" disabled={loginState.isLoading}>
          Войти
        </Button>
      </div>
    </form>
  );
}
