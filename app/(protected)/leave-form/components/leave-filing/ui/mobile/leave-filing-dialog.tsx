"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LeaveFilingForm from "../leave-filing-form"

export default function LeaveFilingDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>File a Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <LeaveFilingForm />
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
