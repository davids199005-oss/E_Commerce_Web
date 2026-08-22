"use client"

import type { ReactElement } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import type { AdminPageProps } from "@/lib/types/components/admin"

export function AdminPage({
  title,
  description,
  actions,
  children,
}: AdminPageProps): ReactElement {
  return (
    <PageContainer
      title={title}
      description={description}
      actions={actions}
      className="max-w-none px-0 py-0 sm:px-0 sm:py-0 lg:px-0"
    >
      {children}
    </PageContainer>
  )
}
