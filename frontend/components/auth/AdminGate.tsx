"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/hooks/hooks";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user && !user.is_admin) {
      router.replace("/");
    }
  }, [isHydrated, token, user, router]);

  if (!isHydrated || (token && !user)) {
    return (
      <PageContainer>
        <div className="grid gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!token || !user?.is_admin) {
    return null;
  }

  return children;
}
