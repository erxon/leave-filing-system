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
import { useEffect, useState } from "react"
import { getAvatar } from "../../profile/actions"

interface AdminData {
  avatar: string
  company_id: string
  user_id: string
  first_name: string
  last_name: string
}

export function NavAdminUser({ adminData }: { adminData: AdminData }) {
  const [avatar, setAvatar] = useState<string>(adminData.avatar)
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleLogout = () => {
    const supabase = createClient()
    supabase.auth.signOut()
    router.push("/auth/login")
  }

  useEffect(() => {
    let mounted = true
    const fetchAvatarUrl = async () => {
      const url = await getAvatar()
      if (mounted) setAvatar(url)
    }
    fetchAvatarUrl()
    return () => { mounted = false }
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg after:rounded-lg after:border-0">
                <AvatarImage
                  src={avatar}
                  alt={`${adminData.first_name} ${adminData.last_name}`}
                />
                <AvatarFallback className="rounded-lg">
                  {adminData.first_name.slice(0, 1).toUpperCase()}
                  {adminData.last_name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {adminData.first_name} {adminData.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {adminData.company_id}
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
                <Avatar className="rounded-lg after:rounded-lg after:border-0">
                  <AvatarImage
                    src={avatar}
                    alt={`${adminData.first_name} ${adminData.last_name}`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {adminData.first_name.slice(0, 1).toUpperCase()}
                    {adminData.last_name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {adminData.first_name} {adminData.last_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {adminData.company_id}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/admin/profile")
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
