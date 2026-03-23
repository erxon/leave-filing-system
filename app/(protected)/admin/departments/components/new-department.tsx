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
import { Plus } from "lucide-react"
import DepartmentForm from "./department-form"
import { Department } from "./departments.type"

interface NewDepartmentProps {
  companyId: string
}

export default function NewDepartment({ companyId }: NewDepartmentProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Department</DialogTitle>
          <DialogDescription>
            Add a new department to the company.
          </DialogDescription>
        </DialogHeader>
        <DepartmentForm
          mode="create"
          companyId={companyId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export function EditDepartment({
  companyId,
  department,
  trigger,
}: NewDepartmentProps & {
  department: Department
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
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the details for this department.
          </DialogDescription>
        </DialogHeader>
        <DepartmentForm
          mode="update"
          companyId={companyId}
          department={department}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
