"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ellipsis, Users } from "lucide-react"
import { AvatarLarge, AvatarSmall } from "./employee-avatars"

interface Member {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  position?: {
    position_name: string
  }
}

interface DepartmentMembersProps {
  members: Member[]
}

export function DepartmentMembers({ members }: DepartmentMembersProps) {
  const displayLimit = 5
  const hasMore = members.length > displayLimit
  const displayMembers = members.slice(0, displayLimit)
  const remainingCount = members.length - displayLimit

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Department Teammates
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription className="text-xs">
          {members.length} members in your department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 space-y-4">
          <div className="flex -space-x-3 overflow-hidden">
            {displayMembers.map((member) => (
              <AvatarSmall
                key={member.id}
                avatar_url={member.avatar_url || ""}
                fallback={`${member.first_name[0]}${member.last_name[0]}`}
              />
            ))}
            {hasMore && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium transition-transform hover:scale-110">
                +{remainingCount}
              </div>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Ellipsis />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Department Members</DialogTitle>
                <DialogDescription>
                  Full list of employees in your department
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-4 py-4">
                  {members.map((member) => {
                    const positionName = (member.position as { position_name: string } | undefined)?.position_name || "Employee"
                    return (
                      <div
                        key={member.id}
                        className="flex items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <AvatarLarge
                          avatar_url={member.avatar_url || ""}
                          fallback={`${member.first_name[0]}${member.last_name[0]}`}
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-none font-medium">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {positionName}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
