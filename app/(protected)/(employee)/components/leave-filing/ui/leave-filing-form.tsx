"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MultipleDatePicker from "./multiple-date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCallback, useEffect, useState } from "react"
import { Employee } from "@/app/(protected)/admin/components/user-creation/ui/users/columns"
import { createClient } from "@/lib/supabase/client"

export default function LeaveFilingForm({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [employee, setEmployee] = useState<Employee | null>(null)

  const fetchEmployee = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from("employee_profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      if (data) {
        setEmployee(data)
      }
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployee()
  }, [fetchEmployee])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Filing Form</DialogTitle>
            <DialogDescription>Fill all the required details</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 overflow-auto">
            <Input
              placeholder="Employee ID"
              type="text"
              value={employee?.employee_id}
              readOnly
            />
            <Input
              placeholder="First Name"
              type="text"
              value={employee?.first_name}
              readOnly
            />
            <Input
              placeholder="Last Name"
              type="text"
              value={employee?.last_name}
              readOnly
            />
            <MultipleDatePicker />
          </div>
          <DialogFooter>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
