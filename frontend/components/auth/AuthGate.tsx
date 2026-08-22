"use client"

import { useEffect } from "react"
import type { ReactElement } from "react"
import { useRouter } from "next/navigation"
import { LoadingRows } from "@/components/feedback/LoadingRows"
import { PageContainer } from "@/components/layout/PageContainer"
import { selectIsAuthenticated, selectIsHydrated } from "@/lib/features/auth/authSlice"
import { useAppSelector } from "@/lib/redux/hooks"
import type { AuthGateProps } from "@/lib/types/components/auth"

export function AuthGate({ children }: AuthGateProps): ReactElement | null {
  const router = useRouter()
  const isHydrated: boolean = useAppSelector(selectIsHydrated)
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isHydrated || isAuthenticated) return
    router.replace("/login")
  }, [isAuthenticated, isHydrated, router])

  if (!isHydrated) {
    return (
      <PageContainer>
        <LoadingRows rows={4} />
      </PageContainer>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}
