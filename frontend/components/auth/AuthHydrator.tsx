"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { hydrated } from "@/lib/features/auth/authSlice";
import { authStorage } from "@/lib/features/auth/authStorage";
import { useGetMeQuery } from "@/lib/features/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";

export function AuthHydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(hydrated(authStorage.read()));
  }, [dispatch]);

  useGetMeQuery(undefined, { skip: !isHydrated || !token });

  return children;
}
