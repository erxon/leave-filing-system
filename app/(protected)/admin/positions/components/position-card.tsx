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
import { Edit2, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PositionCard({
  position,
}: {
  position: {
    id: string
    name: string
    description: string
    department_id: string
    reporting_to?: { name: string } | null
  }
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
        <Button variant="outline" size="sm" className="flex-1">
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" className="flex-1">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
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
