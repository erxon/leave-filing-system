"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  approveLeave,
  pendingLeave,
  rejectLeave,
  removeLeave,
} from "../../actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export function ApproveDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await approveLeave(id)

      if (!result.success) {
        toast.error("Something went wrong")
      } else {
        toast.success("Leave was approved")
        setOpen(false)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Leave</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this leave request?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RejectDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [remarks, setRemarks] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const result = await rejectLeave(id, remarks)

    if (result.error) {
      console.error("Error rejecting leave:", result.error)
      toast.error("Something went wrong")
    } else {
      toast.success("Leave was rejected")
      setOpen(false)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Leave</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this leave request?
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            placeholder="Remarks"
            rows={4}
            className="resize-none"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PendingDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await pendingLeave(id)

      if (!result.success) {
        toast.error("Something went wrong")
      } else {
        toast.success("Leave was set to pending")
        setOpen(false)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set leave to pending</DialogTitle>
          <DialogDescription>
            Are you sure you want to set this leave request to pending?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Setting to pending..." : "Set to Pending"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RemoveDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await removeLeave(id)

      if (!result.success) {
        toast.error("Something went wrong")
      } else {
        toast.info("Leave was removed")
        setOpen(false)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Leave</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this leave request?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
