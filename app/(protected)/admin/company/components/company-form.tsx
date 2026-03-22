"use client"

import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { updateCompanyDetails } from "./actions"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.email("Invalid email address"),
  description: z.string().min(1, "Company description is required"),
})

interface CompanyFormProps {
  company: {
    id: string
    description: string
    name: string
    phone: string
    email: string
  }
}

export default function CompanyForm({ company }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: company.name || "",
      phone: company.phone || "",
      email: company.email || "",
      description: company.description || "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        const result = await updateCompanyDetails(company.id, value)
        if (result.success) {
          toast.success("Company details updated successfully")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update company details")
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="ACME Corp"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-4 resize-none"
                  placeholder="Description"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="phone">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+639123456789"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="contact@company.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
