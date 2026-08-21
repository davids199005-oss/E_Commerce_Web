"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import { useRegisterMutation } from "@/lib/features/auth/authApi";

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 text-sm md:text-sm"
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, registerState] = useRegisterMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        country,
        city,
        username,
        password,
      }).unwrap();
      toast.success("Аккаунт создан. Войдите, чтобы продолжить.");
      router.push("/login");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border"
    >
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Регистрация
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="first" label="Имя" value={firstName} onChange={setFirstName} autoComplete="given-name" />
        <Field id="last" label="Фамилия" value={lastName} onChange={setLastName} autoComplete="family-name" />
        <Field id="email" label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
        <Field id="phone" label="Телефон" value={phone} onChange={setPhone} autoComplete="tel" />
        <Field id="country" label="Страна" value={country} onChange={setCountry} autoComplete="country-name" />
        <Field id="city" label="Город" value={city} onChange={setCity} autoComplete="address-level2" />
        <Field id="username" label="Логин" value={username} onChange={setUsername} autoComplete="username" />
        <Field
          id="password"
          label="Пароль"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
        />
      </div>
      <Button
        type="submit"
        size="xl"
        className="mt-6 w-full sm:w-auto"
        disabled={registerState.isLoading}
      >
        Создать аккаунт
      </Button>
    </form>
  );
}
