import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FilePlus, History, Calendar, Gauge } from "lucide-react"
import Link from "next/link"
import FetchUser from "@/components/sidebar/fetch-user"
import { Suspense } from "react"

const menus = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Gauge,
  },
  {
    title: "History",
    url: "/leave/history",
    icon: History,
  },
  {
    title: "Leave Request",
    url: "/leave/file",
    icon: FilePlus,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
]

export function EmployeeSidebar() {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menus.map((menu) => (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton tooltip={menu.title} asChild>
                      <Link href={menu.url}>
                        <menu.icon /> {menu.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Suspense fallback={<div>Loading...</div>}>
                <FetchUser />
              </Suspense>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
