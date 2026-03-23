"use client"

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { getSignedUrl } from "@/app/(protected)/(employee)/profile/actions"

export function NavUser({
  user,
}: {
  user: {
    name: {
      first_name: string
      last_name: string
    }
    employee_id: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [avatar, setAvatar] = useState<string | null>(user.avatar)

  const handleLogout = () => {
    const supabase = createClient()
    supabase.auth.signOut()
    router.push("/auth/login")
  }

  const fetchSignedUrlForAvatar = useCallback(async () => {
    if (user.avatar) {
      try {
        const data = await getSignedUrl({ filePath: user.avatar })
        if (data && data.signedUrl) {
          setAvatar(data.signedUrl)
        } else if (data && data.error) {
          console.error("Failed to fetch signed URL:", data.error)
        }
      } catch (err) {
        console.error("Error in fetchSignedUrlForAvatar:", err)
      }
    }
  }, [user.avatar])

  useEffect(() => {
    fetchSignedUrlForAvatar()
  }, [fetchSignedUrlForAvatar])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={avatar || undefined}
                  alt={`${user.name.first_name} ${user.name.last_name}`}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name.first_name.slice(0, 1).toUpperCase()}
                  {user.name.last_name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.name.first_name} {user.name.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.employee_id}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={avatar || undefined}
                    alt={`${user.name.first_name} ${user.name.last_name}`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name.first_name.slice(0, 1).toUpperCase()}
                    {user.name.last_name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name.first_name} {user.name.last_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.employee_id}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/profile")
                }}
              >
                <IconUserCircle />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
