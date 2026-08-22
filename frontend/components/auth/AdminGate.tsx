"use client"

import type { ReactElement } from "react"
import { AuthGate } from "@/components/auth/AuthGate"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { PageContainer } from "@/components/layout/PageContainer"
import { useGetMeQuery } from "@/lib/features/auth/authApi"
import type { AdminGateProps } from "@/lib/types/components/auth"

function AdminOnly({ children }: AdminGateProps): ReactElement {
  const { data: user, error, isError, refetch } = useGetMeQuery()

  if (isError) {
    return (
      <PageContainer>
        <ErrorState error={error} onRetry={refetch} title="We could not confirm your account" />
      </PageContainer>
    )
  }

  if (user === undefined) {
    return (
      <PageContainer>
        <LoadingRows rows={3} />
      </PageContainer>
    )
  }

  if (!user.is_admin) {
    return (
      <PageContainer title="Admin">
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">This area is for administrators.</p>
        </div>
      </PageContainer>
    )
  }

  return <>{children}</>
}

export function AdminGate({ children }: AdminGateProps): ReactElement {
  return (
    <AuthGate>
      <AdminOnly>{children}</AdminOnly>
    </AuthGate>
  )
}
