"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { addDepartment, updateDepartment } from "./actions"
import { Department } from "./departments.type"

const formSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string(),
})

interface DepartmentFormProps {
  mode?: "create" | "update"
  companyId: string
  department?: Department
  onSuccess: () => void
}

export default function DepartmentForm({
  mode = "create",
  companyId,
  department,
  onSuccess,
}: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        let result
        if (mode === "create") {
          result = await addDepartment({
            ...value,
            company_id: companyId,
          })
        } else {
          result = await updateDepartment(department!.id, value)
        }

        if (result.success) {
          toast.success(
            mode === "create"
              ? "Department created successfully"
              : "Department updated successfully"
          )
          if (mode === "create") form.reset()
          onSuccess()
        } else {
          toast.error(result.error || `Failed to ${mode} department`)
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
      id="department-form"
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
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Engineering"
                  autoComplete="off"
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
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell us more about this department"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "create" ? "Creating..." : "Updating..."}
          </>
        ) : mode === "create" ? (
          "Create Department"
        ) : (
          "Update Department"
        )}
      </Button>
    </form>
  )
}
