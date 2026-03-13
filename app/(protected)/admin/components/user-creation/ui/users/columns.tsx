"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Employee = {
  employee_id: string
  first_name: string
  last_name: string
  manager_id: string
  role: string
}

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employee_id",
    header: "Employee ID",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "manager_id",
    header: "Supervisor/Manager",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]
