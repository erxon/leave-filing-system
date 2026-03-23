"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addPosition, updatePosition } from "./actions"

const formSchema = z.object({
  name: z.string().min(1, "Position name is required"),
  description: z.string(),
  department_id: z.string().min(1, "Please select a department"),
  reports_to: z.string(),
})

interface NewPositionProps {
  companyId: string
  departments: { id: string; name: string }[]
  positions: { id: string; name: string }[]
}

export default function NewPosition({
  companyId,
  departments,
  positions,
}: NewPositionProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Position
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Position</DialogTitle>
          <DialogDescription>
            Add a new position to the company.
          </DialogDescription>
        </DialogHeader>
        <PositionForm
          mode="create"
          companyId={companyId}
          departments={departments}
          positions={positions}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export function EditPosition({
  companyId,
  departments,
  positions,
  position,
  trigger,
}: NewPositionProps & {
  position: {
    id: string
    name: string
    description: string
    department_id: string
    reports_to?: string | null
  }
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Position</DialogTitle>
          <DialogDescription>
            Update the details for this position.
          </DialogDescription>
        </DialogHeader>
        <PositionForm
          mode="update"
          companyId={companyId}
          departments={departments}
          positions={positions}
          position={position}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function PositionForm({
  mode = "create",
  companyId,
  departments,
  positions,
  position,
  onSuccess,
}: NewPositionProps & {
  mode?: "create" | "update"
  position?: {
    id: string
    name: string
    description: string
    department_id: string
    reports_to?: string | null
  }
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: position?.name || "",
      description: position?.description || "",
      department_id: position?.department_id || "",
      reports_to: position?.reports_to || "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        const reports_to =
          value.reports_to && value.reports_to !== "none"
            ? value.reports_to
            : undefined

        let result
        if (mode === "create") {
          result = await addPosition({
            ...value,
            company_id: companyId,
            reports_to,
          })
        } else {
          result = await updatePosition(position!.id, {
            ...value,
            reports_to,
          })
        }

        if (result.success) {
          toast.success(
            mode === "create"
              ? "Position created successfully"
              : "Position updated successfully"
          )
          if (mode === "create") form.reset()
          onSuccess()
        } else {
          toast.error(result.error || `Failed to ${mode} position`)
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
      id="new-position-form"
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
                  placeholder="e.g. Senior Software Engineer"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="department_id">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Tell us more about this role"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="reports_to">
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Reports To (Optional)</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select a manager position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={field.state.meta.errors} />
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
          "Create Position"
        ) : (
          "Update Position"
        )}
      </Button>
    </form>
  )
}
