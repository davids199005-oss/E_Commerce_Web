"use client"

import type { FormEvent, ReactElement } from "react"
import { Button } from "@/components/ui/button"
import type { AuthFormProps } from "@/lib/types/components/auth"

export function AuthForm({
  title,
  description,
  submitLabel,
  pendingLabel,
  isPending,
  formError,
  onSubmit,
  children,
  footer,
}: AuthFormProps): ReactElement {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (isPending) return
    onSubmit()
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {formError !== null && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm leading-relaxed text-destructive"
          >
            {formError}
          </p>
        )}

        {children}

        <Button type="submit" size="lg" disabled={isPending} className="h-10 w-full text-sm">
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  )
}
