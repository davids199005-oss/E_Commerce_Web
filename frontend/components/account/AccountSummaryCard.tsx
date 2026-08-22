"use client"

import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, Shield01Icon, UserCircleIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/format/date"
import type { AccountSummaryCardProps } from "@/lib/types/components/account"

export function AccountSummaryCard({ user }: AccountSummaryCardProps): ReactElement {
  const fullName: string = `${user.first_name} ${user.last_name}`.trim()

  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <HugeiconsIcon icon={UserCircleIcon} size={24} strokeWidth={1.8} />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="font-heading text-base font-medium text-foreground">
            {fullName === "" ? user.username : fullName}
          </p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.8} />
          Member since <span className="font-mono">{formatDate(user.created_at)}</span>
        </p>

        {user.is_admin && (
          <Badge variant="secondary">
            <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} />
            Administrator
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
