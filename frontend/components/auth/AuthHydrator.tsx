"use client"

import { useEffect } from "react"
import type { ReactElement } from "react"
import { useGetMeQuery } from "@/lib/features/auth/authApi"
import { hydrated, selectIsHydrated, selectToken, userReceived } from "@/lib/features/auth/authSlice"
import { authStorage } from "@/lib/features/auth/authStorage"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import type { AuthHydratorProps } from "@/lib/types/components/auth"

export function AuthHydrator({ children }: AuthHydratorProps): ReactElement {
  const dispatch = useAppDispatch()
  const isHydrated: boolean = useAppSelector(selectIsHydrated)
  const token: string | null = useAppSelector(selectToken)

  useEffect(() => {
    if (isHydrated) return
    dispatch(hydrated(authStorage.read()))
  }, [dispatch, isHydrated])

  const { data: user } = useGetMeQuery(undefined, { skip: !isHydrated || token === null })

  useEffect(() => {
    if (user === undefined) return
    dispatch(userReceived(user))
  }, [dispatch, user])

  return <>{children}</>
}
