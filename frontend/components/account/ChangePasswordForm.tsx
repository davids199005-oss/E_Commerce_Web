"use client"

import { useState } from "react"
import type { FormEvent, ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SquareLock02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/lib/api/errorMessage"
import { useChangePasswordMutation } from "@/lib/features/users/usersApi"

const MIN_NEW_LENGTH = 8
const MAX_NEW_LENGTH = 72

export function ChangePasswordForm(): ReactElement {
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")

  const isNewPasswordValid: boolean =
    newPassword.length >= MIN_NEW_LENGTH && newPassword.length <= MAX_NEW_LENGTH
  const showLengthError: boolean = newPassword.length > 0 && !isNewPasswordValid
  const canSubmit: boolean = currentPassword.length > 0 && isNewPasswordValid && !isLoading

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!canSubmit) return

    const result = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    })

    if ("error" in result) {
      toast.error(getErrorMessage(result.error))
      return
    }

    toast.success(result.data.message)
    setCurrentPassword("")
    setNewPassword("")
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Password</CardTitle>
        <CardDescription className="text-sm">
          Changing it here does not sign you out anywhere else.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            void submit(event)
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="current-password" className="text-sm">
                Current password
              </Label>
              <Input
                id="current-password"
                className="h-9 text-sm"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                disabled={isLoading}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-sm">
                New password
              </Label>
              <Input
                id="new-password"
                className="h-9 text-sm"
                type="password"
                autoComplete="new-password"
                aria-invalid={showLengthError}
                aria-describedby="new-password-hint"
                value={newPassword}
                disabled={isLoading}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <p
                id="new-password-hint"
                className={
                  showLengthError ? "text-xs text-destructive" : "text-xs text-muted-foreground"
                }
              >
                Between {MIN_NEW_LENGTH} and {MAX_NEW_LENGTH} characters.
              </p>
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-6" disabled={!canSubmit}>
            <HugeiconsIcon icon={SquareLock02Icon} strokeWidth={1.8} />
            {isLoading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
