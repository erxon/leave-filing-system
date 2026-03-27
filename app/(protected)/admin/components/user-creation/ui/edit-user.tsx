"use client"

import { useState, useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { updateEmployee } from "../actions"
import RoleSelector from "./role-selector"
import { ManagersSelector } from "./managers-selector"
import { getPositions } from "../../../positions/components/actions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { EmployeeProfile } from "@/lib/types"

const formSchema = z.object({
  employee_id: z.string().min(1, "Please fill the employee ID"),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  manager_id: z.object({
    label: z.string(),
    value: z.string(),
  }),
  role: z.string(),
  position_id: z.string().min(1, "Please select a position"),
})

export default function EditUserForm({
  employee,
  company_id,
}: {
  employee: EmployeeProfile
  company_id: string
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [positions, setPositions] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchPositions = async () => {
      const data = await getPositions(company_id)
      setPositions(data)
    }
    fetchPositions()
  }, [company_id])

  const form = useForm({
    defaultValues: {
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      manager_id: {
        label: employee.manager_name || "N/A",
        value: employee.manager_id || "",
      },
      role: employee.role === 2 ? "manager" : "employee",
      position_id: employee.position_id || "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        await updateEmployee(
          employee.id,
          value.employee_id,
          value.first_name,
          value.last_name,
          company_id,
          value.manager_id.value,
          value.role,
          value.position_id
        )
        toast.success("User updated successfully")
        router.push("/admin/users")
      } catch (error) {
        console.error(error)
        toast.error("Failed to update user")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Edit User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="grid gap-4 py-4">
            <form.Field name="employee_id">
              {(field) => (
                <Field>
                  <FieldLabel>Employee ID</FieldLabel>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="first_name">
                {(field) => (
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="last_name">
                {(field) => (
                  <Field>
                    <FieldLabel>Last Name</FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </div>
            <form.Field name="position_id">
              {(field) => (
                <Field>
                  <FieldLabel>Position</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <RoleSelector
                    value={field.state.value}
                    onSelect={(val: string | null) => field.handleChange(val!)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="manager_id">
              {(field) => (
                <Field>
                  <FieldLabel>Manager</FieldLabel>
                  <ManagersSelector
                    companyId={company_id}
                    field={field}
                    value={field.state.value}
                    onSelect={(val: { label: string; value: string } | null) =>
                      field.handleChange(val!)
                    }
                    disabled={false}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Update User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
