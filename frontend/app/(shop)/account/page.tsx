"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/api";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import { loggedOut } from "@/lib/features/auth/authSlice";
import { authStorage } from "@/lib/features/auth/authStorage";
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateMeMutation,
} from "@/lib/features/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import type { UserProfile } from "@/lib/types/api";

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
      />
    </div>
  );
}

function AccountForms({ user }: { user: UserProfile }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [country, setCountry] = useState(user.country);
  const [city, setCity] = useState(user.city);
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateMe, updateState] = useUpdateMeMutation();
  const [changePassword, passwordState] = useChangePasswordMutation();
  const [deleteAccount, deleteState] = useDeleteAccountMutation();

  async function handleProfile(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      await updateMe({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        country,
        city,
        username,
      }).unwrap();
      toast.success("Профиль сохранён");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handlePassword(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Пароль изменён");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      await deleteAccount().unwrap();
      authStorage.clear();
      dispatch(loggedOut());
      dispatch(api.util.resetApiState());
      router.push("/");
      toast.success("Аккаунт удалён");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={(event) => {
          void handleProfile(event);
        }}
        className="grid gap-4 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border"
      >
        <h2 className="font-heading text-lg font-semibold">Профиль</h2>
        <Field id="first" label="Имя" value={firstName} onChange={setFirstName} />
        <Field id="last" label="Фамилия" value={lastName} onChange={setLastName} />
        <Field id="email" label="Email" value={email} onChange={setEmail} type="email" />
        <Field id="phone" label="Телефон" value={phone} onChange={setPhone} />
        <Field id="country" label="Страна" value={country} onChange={setCountry} />
        <Field id="city" label="Город" value={city} onChange={setCity} />
        <Field id="username" label="Логин" value={username} onChange={setUsername} />
        <Button type="submit" size="xl" disabled={updateState.isLoading}>
          Сохранить
        </Button>
      </form>

      <div className="grid gap-8">
        <form
          onSubmit={(event) => {
            void handlePassword(event);
          }}
          className="grid gap-4 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border"
        >
          <h2 className="font-heading text-lg font-semibold">Пароль</h2>
          <Field
            id="current-password"
            label="Текущий пароль"
            value={currentPassword}
            onChange={setCurrentPassword}
            type="password"
          />
          <Field
            id="new-password"
            label="Новый пароль"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
          />
          <Button type="submit" size="xl" disabled={passwordState.isLoading}>
            Сменить пароль
          </Button>
        </form>

        <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="font-heading text-lg font-semibold">Удаление аккаунта</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Это действие нельзя отменить.
          </p>
          <Button
            variant="destructive"
            size="xl"
            className="mt-4"
            onClick={() => setDeleteOpen(true)}
          >
            Удалить аккаунт
          </Button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить аккаунт?</DialogTitle>
            <DialogDescription>
              Профиль и связанные данные будут удалены.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              disabled={deleteState.isLoading}
              onClick={() => {
                void handleDelete();
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccountContent() {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) {
    return <p className="text-sm text-muted-foreground">Загрузка профиля…</p>;
  }
  return <AccountForms user={user} />;
}

export default function AccountPage() {
  return (
    <AuthGate>
      <PageContainer>
        <h1 className="mb-6 font-heading text-3xl font-semibold tracking-tight">
          Аккаунт
        </h1>
        <AccountContent />
      </PageContainer>
    </AuthGate>
  );
}

