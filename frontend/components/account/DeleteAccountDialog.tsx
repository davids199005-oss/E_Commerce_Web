"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/lib/api/errorMessage"
import { useDeleteMeMutation } from "@/lib/features/users/usersApi"
import type { DeleteAccountDialogProps } from "@/lib/types/components/account"

export function DeleteAccountDialog({
  username,
  onDeleted,
}: DeleteAccountDialogProps): ReactElement {
  const [deleteMe, { isLoading }] = useDeleteMeMutation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [confirmation, setConfirmation] = useState<string>("")

  const isConfirmed: boolean = confirmation === username

  function handleOpenChange(nextOpen: boolean): void {
    if (isLoading) return
    setIsOpen(nextOpen)
    if (!nextOpen) setConfirmation("")
  }

  async function submit(): Promise<void> {
    const result = await deleteMe()

    if ("error" in result) {
      toast.error(getErrorMessage(result.error))
      return
    }

    toast.success("Your account has been deleted.")
    setIsOpen(false)
    onDeleted()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button variant="destructive" size="lg" />}>
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
        Delete account
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.8} />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes your account and everything attached to it: your details, your favorites,
            the cart you are building and your whole order history. It cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="delete-confirmation" className="block text-sm">
            Type <span className="font-mono">{username}</span> to confirm
          </Label>
          <Input
            id="delete-confirmation"
            className="h-9 text-sm"
            autoComplete="off"
            value={confirmation}
            disabled={isLoading}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Keep my account</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!isConfirmed || isLoading}
            onClick={() => {
              void submit()
            }}
          >
            {isLoading ? "Deleting…" : "Delete account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
