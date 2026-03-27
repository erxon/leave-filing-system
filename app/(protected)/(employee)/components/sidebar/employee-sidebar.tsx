import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FilePlus, History, Calendar, Gauge, Users } from "lucide-react"
import Link from "next/link"
import FetchUser from "@/components/sidebar/fetch-user"
import { Suspense } from "react"
import { getEmployee } from "@/app/auth/actions"
import {
  CompanyLogo,
  CompanyName,
} from "@/app/(protected)/admin/components/sidebar/company-details"
import CompanyDetails from "./company-details"

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

const managementMenus = [
  {
    title: "Direct reports",
    url: "/direct-reports",
    icon: Users,
  },
  {
    title: "Approvals",
    url: "/approvals",
    icon: Calendar,
  },
]

export async function EmployeeSidebar() {
  const employee = await getEmployee()

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <CompanyDetails />
          </Suspense>
        </SidebarHeader>
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
          {employee.role === 2 && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarMenu>
                  {managementMenus.map((menu) => (
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
          )}
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
