"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Copy, Ellipsis, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteUser } from "../../actions"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import DeleteAlert from "@/components/alerts/delete-alert"
import { useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Employee = {
  id: string
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
    accessorKey: "temp_password",
    header: "Temp Password",
    cell: ({ row }) => {
      const [togglePassword, setTogglePassword] = useState<boolean>(false)

      const password = row.getValue("temp_password") as string
      return (
        <div className="flex items-center gap-2">
          <Input
            type={togglePassword ? "text" : "password"}
            value={password}
            readOnly
            className="text-sm"
            size={8}
          />
          {password && (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setTogglePassword(!togglePassword)
                }}
              >
                <Eye />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  navigator.clipboard.writeText(password)
                  toast.info("Copied to clipboard")
                }}
              >
                <Copy />
              </Button>
            </>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex items-center gap-2">
          <Menu employee={employee} />
        </div>
      )
    },
  },
]

function Menu({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteUser(employee.id)
      setOpen(false)
      setLoading(false)
      toast.success("User deleted successfully")
    } catch (error) {
      setLoading(false)
      toast.error("Failed to delete user")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAlert
        title="Delete User"
        description="Are you sure you want to delete this user?"
        action="Delete"
        cancel="Cancel"
        onAction={handleDelete}
        open={open}
        setOpen={setOpen}
        loading={isLoading}
      />
    </>
  )
}
