"use client"

import type { ChangeEvent, ReactElement } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuthFieldProps } from "@/lib/types/components/auth"
import { cn } from "@/lib/utils"

export function AuthField({
  id,
  label,
  value,
  onValueChange,
  type = "text",
  autoComplete,
  hint,
  error,
  disabled = false,
  className,
}: AuthFieldProps): ReactElement {
  const hasError: boolean = error !== undefined && error !== ""
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm text-foreground">
        {label}
      </Label>

      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : hint !== undefined ? hintId : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value)}
        className="h-10 rounded-lg px-3 text-sm md:text-sm"
      />

      {hasError ? (
        <p id={errorId} className="text-xs leading-relaxed text-destructive">
          {error}
        </p>
      ) : (
        hint !== undefined && (
          <p id={hintId} className="text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
