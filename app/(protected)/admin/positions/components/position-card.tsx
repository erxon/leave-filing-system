"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit2, Loader2, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditPosition } from "./new-position"
import { useState } from "react"
import { deletePosition } from "./actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PositionCard({
  position,
  companyId,
  departments,
  positions,
}: {
  position: {
    id: string
    name: string
    description: string
    department_id: string
    reports_to?: string | null
    reporting_to?: { name: string } | null
  }
  companyId: string
  departments: { id: string; name: string }[]
  positions: { id: string; name: string }[]
}) {
  const reportsTo = position.reporting_to?.name || "None"

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{position.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        </div>
        <CardDescription>{position.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Employees />
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-sm text-muted-foreground">Reports to</span>
          <span className="text-sm font-medium">{reportsTo}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <EditPosition
          companyId={companyId}
          departments={departments}
          positions={positions}
          position={position}
          trigger={
            <Button variant="outline" size="sm" className="flex-1">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />
        <DeletePosition
          position={position}
          trigger={
            <Button variant="destructive" size="sm" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          }
        />
      </CardFooter>
    </Card>
  )
}

function DeletePosition({
  position,
  trigger,
}: {
  position: {
    id: string
    name: string
    description: string
    department_id: string
    reports_to?: string | null
    reporting_to?: { name: string } | null
  }
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deletePosition(position.id)
      if (result.success) {
        toast.success("Position deleted successfully")
        setOpen(false)
      } else {
        toast.error(result.error || "Failed to delete position")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm" className="flex-1">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Position</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this position?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{position.name}</p>
            <p className="text-sm text-muted-foreground">
              {position.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-sm text-muted-foreground">Reports to</span>
            <span className="text-sm font-medium">
              {position.reporting_to?.name || "None"}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Employees() {
  return (
    <div className="flex items-center justify-between">
      <Employee />
      <Button variant="link">View all</Button>
    </div>
  )
}

function Employee() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=John" />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">John Doe</p>
        <p className="text-xs text-muted-foreground">Team Lead</p>
      </div>
    </div>
  )
}
