"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { skipToken } from "@reduxjs/toolkit/query"
import { UserSearch01Icon } from "@hugeicons/core-free-icons"
import { AdminPage } from "@/components/admin/AdminPage"
import { ChurnReport } from "@/components/admin/ChurnReport"
import { UserPicker } from "@/components/admin/UserPicker"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { Card, CardContent } from "@/components/ui/card"
import { isHttpStatus } from "@/lib/api/errorMessage"
import { useGetChurnQuery } from "@/lib/features/analytics/analyticsApi"
import { useListUsersQuery } from "@/lib/features/users/usersApi"
import type { QueryError } from "@/lib/types/admin"
import type { UserListItem } from "@/lib/types/api"

function churnErrorTitle(error: QueryError): string {
  if (isHttpStatus(error, 503)) return "The churn model is not loaded on the server"
  if (isHttpStatus(error, 404)) return "That customer no longer exists"
  return "We could not produce an estimate"
}

export default function AdminAnalyticsPage(): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const {
    data: usersData,
    error: usersError,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useListUsersQuery()

  const numericId: number | null = selectedId === null ? null : Number(selectedId)
  const {
    data: prediction,
    error: churnError,
    isError: isChurnError,
    refetch: refetchChurn,
  } = useGetChurnQuery(numericId ?? skipToken)

  const users: readonly UserListItem[] | undefined = usersData?.users
  const selected: UserListItem | undefined = users?.find((user) => String(user.id) === selectedId)

  let content: ReactElement
  if (isUsersError) {
    content = (
      <ErrorState error={usersError} onRetry={refetchUsers} title="We could not load the customers" />
    )
  } else if (users === undefined) {
    content = <LoadingRows rows={3} />
  } else {
    let result: ReactElement
    if (selected === undefined) {
      result = (
        <EmptyState
          icon={UserSearch01Icon}
          title="Nobody chosen yet"
          description="Pick a customer above and the model will estimate how likely they are to stop buying."
        />
      )
    } else if (isChurnError) {
      result = (
        <ErrorState
          error={churnError}
          onRetry={refetchChurn}
          title={churnErrorTitle(churnError)}
        />
      )
    } else if (prediction === undefined) {
      result = <LoadingRows rows={2} />
    } else {
      result = <ChurnReport prediction={prediction} username={selected.username} />
    }

    content = (
      <div className="space-y-6">
        <Card>
          <CardContent>
            <UserPicker users={users} value={selectedId} onChange={setSelectedId} />
          </CardContent>
        </Card>
        {result}
      </div>
    )
  }

  return (
    <AdminPage
      title="Churn analytics"
      description="A trained model's read on one customer at a time. Treat it as a hint worth acting on, never as a verdict about the person."
    >
      {content}
    </AdminPage>
  )
}
