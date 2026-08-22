"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthField } from "@/components/auth/AuthField"
import { AuthForm } from "@/components/auth/AuthForm"
import { fieldErrorsFrom } from "@/components/auth/fieldErrors"
import { getErrorMessage } from "@/lib/api/errorMessage"
import { useRegisterMutation } from "@/lib/features/auth/authApi"
import type { UserCreate } from "@/lib/types/api"
import type { RegisterField, RegisterFieldSpec } from "@/lib/types/auth"
import type { FieldErrors } from "@/lib/types/field-errors"

const PASSWORD_MIN = 8
const PASSWORD_MAX = 72

const FIELDS: readonly RegisterFieldSpec[] = [
  { name: "first_name", label: "First name", type: "text", autoComplete: "given-name", half: true },
  { name: "last_name", label: "Last name", type: "text", autoComplete: "family-name", half: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", half: false },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", half: false },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name", half: true },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2", half: true },
  { name: "username", label: "Username", type: "text", autoComplete: "username", half: false },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    hint: `${PASSWORD_MIN} to ${PASSWORD_MAX} characters.`,
    half: false,
  },
]

const FIELD_NAMES: readonly RegisterField[] = FIELDS.map((field) => field.name)

const EMPTY_DRAFT: UserCreate = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  username: "",
  password: "",
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalize(draft: UserCreate): UserCreate {
  return {
    first_name: draft.first_name.trim(),
    last_name: draft.last_name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    country: draft.country.trim(),
    city: draft.city.trim(),
    username: draft.username.trim(),
    password: draft.password,
  }
}

function validate(draft: UserCreate): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {}

  for (const field of FIELDS) {
    if (draft[field.name].trim() === "") errors[field.name] = `${field.label} is required.`
  }

  if (errors.email === undefined && !EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = "Enter a valid email address."
  }

  if (
    errors.password === undefined &&
    (draft.password.length < PASSWORD_MIN || draft.password.length > PASSWORD_MAX)
  ) {
    errors.password = `Password must be ${PASSWORD_MIN} to ${PASSWORD_MAX} characters.`
  }

  return errors
}

export default function RegisterPage(): ReactElement {
  const router = useRouter()

  const [draft, setDraft] = useState<UserCreate>(EMPTY_DRAFT)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterField>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const [register, { isLoading }] = useRegisterMutation()

  function setField(name: RegisterField, value: string): void {
    setDraft((current) => ({ ...current, [name]: value }))
    setFormError(null)
    setFieldErrors((current) =>
      current[name] === undefined ? current : { ...current, [name]: undefined },
    )
  }

  async function handleSubmit(): Promise<void> {
    const errors: FieldErrors<RegisterField> = validate(draft)
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) return

    const result = await register(normalize(draft))

    if ("error" in result) {
      const message: string = getErrorMessage(result.error)
      setFieldErrors(fieldErrorsFrom(result.error, FIELD_NAMES))
      setFormError(message)
      toast.error(message)
      return
    }

    toast.success("Account created. Sign in to start shopping.")
    router.push("/login")
  }

  return (
    <AuthForm
      title="Create your account"
      description="One account covers favorites, the cart, your orders and the shopping assistant."
      submitLabel="Create account"
      pendingLabel="Creating account..."
      isPending={isLoading}
      formError={formError}
      onSubmit={() => void handleSubmit()}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <AuthField
            key={field.name}
            id={field.name}
            label={field.label}
            type={field.type}
            value={draft[field.name]}
            onValueChange={(next) => setField(field.name, next)}
            autoComplete={field.autoComplete}
            hint={field.hint}
            error={fieldErrors[field.name]}
            disabled={isLoading}
            className={field.half ? undefined : "sm:col-span-2"}
          />
        ))}
      </div>
    </AuthForm>
  )
}
