"use client"

import { useEffect, useState } from "react"
import type { ReactElement } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthField } from "@/components/auth/AuthField"
import { AuthForm } from "@/components/auth/AuthForm"
import { fieldErrorsFrom } from "@/components/auth/fieldErrors"
import { getErrorMessage, isHttpStatus } from "@/lib/api/errorMessage"
import { useGetMeQuery, useLoginMutation } from "@/lib/features/auth/authApi"
import { tokenReceived, userReceived } from "@/lib/features/auth/authSlice"
import { useAppDispatch } from "@/lib/redux/hooks"
import { LOGIN_FIELDS } from "@/lib/types/auth"
import type { LoginField } from "@/lib/types/auth"
import type { FieldErrors } from "@/lib/types/field-errors"

export default function LoginPage(): ReactElement {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginField>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [awaitsProfile, setAwaitsProfile] = useState<boolean>(false)

  const [login, { isLoading }] = useLoginMutation()
  const {
    data: profile,
    error: profileError,
    isFetching: isFetchingProfile,
  } = useGetMeQuery(undefined, { skip: !awaitsProfile })

  useEffect(() => {
    if (!awaitsProfile || isFetchingProfile) return

    if (profile !== undefined) {
      dispatch(userReceived(profile))
      toast.success(`Signed in as ${profile.username}.`)
      router.replace("/catalog")
      return
    }

    if (profileError !== undefined) {
      toast.error(getErrorMessage(profileError))
      router.replace("/catalog")
    }
  }, [awaitsProfile, dispatch, isFetchingProfile, profile, profileError, router])

  function clearError(field: LoginField): void {
    setFormError(null)
    setFieldErrors((current) =>
      current[field] === undefined ? current : { ...current, [field]: undefined },
    )
  }

  async function handleSubmit(): Promise<void> {
    const errors: FieldErrors<LoginField> = {}
    if (username.trim() === "") errors.username = "Enter your username."
    if (password === "") errors.password = "Enter your password."

    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) return

    const result = await login({ username: username.trim(), password })

    if ("error" in result) {
      const message: string = isHttpStatus(result.error, 401)
        ? "Incorrect username or password."
        : getErrorMessage(result.error)
      setFieldErrors(fieldErrorsFrom(result.error, LOGIN_FIELDS))
      setFormError(message)
      toast.error(message)
      return
    }

    dispatch(tokenReceived(result.data.token))
    setAwaitsProfile(true)
  }

  const isPending: boolean = isLoading || awaitsProfile

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to reach your favorites, your cart and your order history."
      submitLabel="Sign in"
      pendingLabel="Signing in..."
      isPending={isPending}
      formError={formError}
      onSubmit={() => void handleSubmit()}
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <AuthField
        id="username"
        label="Username"
        value={username}
        onValueChange={(next) => {
          setUsername(next)
          clearError("username")
        }}
        autoComplete="username"
        error={fieldErrors.username}
        disabled={isPending}
      />

      <AuthField
        id="password"
        label="Password"
        type="password"
        value={password}
        onValueChange={(next) => {
          setPassword(next)
          clearError("password")
        }}
        autoComplete="current-password"
        error={fieldErrors.password}
        disabled={isPending}
      />
    </AuthForm>
  )
}
