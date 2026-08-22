"use client"

import { useState } from "react"
import type { FormEvent, ReactElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, PencilEdit02Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/lib/api/errorMessage"
import { useUpdateMeMutation } from "@/lib/features/users/usersApi"
import type { User } from "@/lib/types/api"
import type {
  ProfileDraft,
  ProfileFieldSpec,
  ProfileFormProps,
} from "@/lib/types/components/account"
import type { UserUpdate } from "@/lib/types/users"

const FIELDS: readonly ProfileFieldSpec[] = [
  { key: "first_name", label: "First name", type: "text", autoComplete: "given-name" },
  { key: "last_name", label: "Last name", type: "text", autoComplete: "family-name" },
  { key: "username", label: "Username", type: "text", autoComplete: "username" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { key: "country", label: "Country", type: "text", autoComplete: "country-name" },
  { key: "city", label: "City", type: "text", autoComplete: "address-level2" },
]

function draftFrom(user: User): ProfileDraft {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
  }
}

function changedFields(draft: ProfileDraft, user: User): UserUpdate {
  const changes: UserUpdate = {}
  for (const field of FIELDS) {
    const next: string = draft[field.key].trim()
    if (next !== user[field.key]) {
      changes[field.key] = next
    }
  }
  return changes
}

export function ProfileForm({ user }: ProfileFormProps): ReactElement {
  const [updateMe, { isLoading }] = useUpdateMeMutation()
  const [draft, setDraft] = useState<ProfileDraft>(() => draftFrom(user))
  const [isEditing, setIsEditing] = useState<boolean>(false)

  function startEditing(): void {
    setDraft(draftFrom(user))
    setIsEditing(true)
  }

  function cancelEditing(): void {
    setDraft(draftFrom(user))
    setIsEditing(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const changes: UserUpdate = changedFields(draft, user)
    if (Object.keys(changes).length === 0) {
      toast.info("Nothing to save — your details are unchanged.")
      return
    }

    const result = await updateMe(changes)
    if ("error" in result) {
      toast.error(getErrorMessage(result.error))
      return
    }

    toast.success("Your details have been saved.")
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Your details</CardTitle>
        <CardDescription className="text-sm">
          These travel with every order you place.
        </CardDescription>
        {!isEditing && (
          <CardAction>
            <Button variant="outline" size="lg" onClick={startEditing}>
              <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={1.8} />
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <form
            noValidate
            onSubmit={(event) => {
              void submit(event)
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={`profile-${field.key}`} className="text-sm">
                    {field.label}
                  </Label>
                  <Input
                    id={`profile-${field.key}`}
                    className="h-9 text-sm"
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={draft[field.key]}
                    disabled={isLoading}
                    onChange={(event) => {
                      const next: string = event.target.value
                      setDraft((current) => ({ ...current, [field.key]: next }))
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="submit" size="lg" disabled={isLoading}>
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={1.8} />
                {isLoading ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                disabled={isLoading}
                onClick={cancelEditing}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key} className="space-y-1">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {field.label}
                </dt>
                <dd className="text-sm break-words text-foreground">
                  {user[field.key].trim() === "" ? "—" : user[field.key]}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
