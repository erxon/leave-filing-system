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
import { generateSecureRandomAlphanumeric } from "@/lib/utils"
import { ManagersSelector } from "./managers-selector"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import RoleSelector from "./role-selector"
import { registerEmployee } from "../actions"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Eye } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  employee_id: z.string().min(1, "Please fill the employee ID"),
  password: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  manager_id: z.object({
    label: z.string(),
    value: z.string(),
  }),
  role: z.string(),
})

export default function CreateUser({ company_id }: { company_id: string }) {
  const [disableManagerSelection, setDisableManagerSelection] =
    useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      employee_id: "",
      password: "",
      first_name: "",
      last_name: "",
      manager_id: {
        label: "",
        value: "",
      },
      role: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { employee_id, password, first_name, last_name, manager_id, role } =
        value

      setIsLoading(true)
      try {
        await registerEmployee(
          employee_id,
          password,
          first_name,
          last_name,
          company_id,
          manager_id.value,
          role
        )

        toast.success("User created successfully")
        form.reset()
      } catch {
        toast.error("Something went wrong, please try again later")
      } finally {
        setIsLoading(false)
      }
    },
  })

  const generateSecurePassword = () => {
    const password = generateSecureRandomAlphanumeric(12)
    form.setFieldValue("password", password)
    toast.success("Secure password generated")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create-user"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="employee_id">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Employee ID</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder="e.g 123456"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                        }}
                        aria-invalid={isInvalid}
                        placeholder=""
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          variant={"ghost"}
                          size={"icon-sm"}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Eye />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <div className="flex items-center justify-start">
              <p className="text-xs">You can generate a secure password</p>
              <Button
                variant={"link"}
                type="button"
                className="w-fit"
                onClick={generateSecurePassword}
              >
                Generate password
              </Button>
            </div>
            <form.Field name="first_name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder=""
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="last_name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder=""
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="role">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <RoleSelector
                      value={field.state.value}
                      onSelect={(value) => {
                        field.handleChange(value!)
                        if (value === "manager") {
                          setDisableManagerSelection(true)
                          field.form.setFieldValue("manager_id", {
                            label: "",
                            value: "",
                          })
                        } else {
                          setDisableManagerSelection(false)
                        }
                      }}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="manager_id">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Manager</FieldLabel>
                    <ManagersSelector
                      companyId={company_id}
                      field={field}
                      value={field.state.value}
                      onSelect={(value) => {
                        field.handleChange(value!)
                      }}
                      disabled={disableManagerSelection}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
          <Button
            type="submit"
            form="create-user"
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Creating user...
              </>
            ) : (
              "Create user"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
