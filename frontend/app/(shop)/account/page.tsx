"use client"

import { useEffect, useState } from "react"
import type { ReactElement } from "react"
import { useRouter } from "next/navigation"
import { AccountSummaryCard } from "@/components/account/AccountSummaryCard"
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm"
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog"
import { ProfileForm } from "@/components/account/ProfileForm"
import { AuthGate } from "@/components/auth/AuthGate"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { PageContainer } from "@/components/layout/PageContainer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetMeQuery } from "@/lib/features/auth/authApi"
import type { AccountViewProps } from "@/lib/types/components/account"

const PAGE_TITLE = "Your account"

function AccountView({ onDeleted }: AccountViewProps): ReactElement {
  const { data: user, error, isError, refetch } = useGetMeQuery()

  if (isError) {
    return (
      <PageContainer title={PAGE_TITLE}>
        <ErrorState error={error} onRetry={refetch} title="We could not load your account" />
      </PageContainer>
    )
  }

  if (user === undefined) {
    return (
      <PageContainer title={PAGE_TITLE}>
        <LoadingRows rows={3} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={PAGE_TITLE}
      description="Your details, your password, and the way out if you want it."
    >
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr] lg:items-start">
        <AccountSummaryCard user={user} />

        <div className="space-y-6">
          <ProfileForm user={user} />
          <ChangePasswordForm />

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Delete account</CardTitle>
              <CardDescription className="text-sm">
                Closing the shop for good. Everything below your name goes with it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountDialog username={user.username} onDeleted={onDeleted} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default function AccountPage(): ReactElement {
  const router = useRouter()
  const [isDeleted, setIsDeleted] = useState<boolean>(false)

  useEffect(() => {
    if (!isDeleted) return
    router.replace("/catalog")
  }, [isDeleted, router])

  if (isDeleted) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Your account has been deleted. Taking you back to the catalog…
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <AuthGate>
      <AccountView onDeleted={() => setIsDeleted(true)} />
    </AuthGate>
  )
}
