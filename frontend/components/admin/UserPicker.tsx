"use client"

import { useMemo } from "react"
import type { ReactElement } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserOption, UserPickerProps } from "@/lib/types/components/admin"

export function UserPicker({ users, value, onChange }: UserPickerProps): ReactElement {
  const options: readonly UserOption[] = useMemo(
    () => users.map((user) => ({ label: user.username, value: String(user.id) })),
    [users],
  )

  return (
    <div className="space-y-1.5">
      <Label htmlFor="churn-user" className="text-sm">
        Customer
      </Label>
      <Select items={options} value={value} onValueChange={onChange}>
        <SelectTrigger id="churn-user" className="h-9 w-full max-w-sm text-sm">
          <SelectValue placeholder="Choose a customer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)} className="text-sm">
                {user.username} — {user.email}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
