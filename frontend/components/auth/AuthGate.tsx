"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/hooks/hooks";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (isHydrated && !token) {
      router.replace("/login");
    }
  }, [isHydrated, token, router]);

  if (!isHydrated) {
    return (
      <PageContainer>
        <div className="grid gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!token) {
    return null;
  }

  return children;
}
