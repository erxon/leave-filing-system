import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Users,
  Building,
  Briefcase,
  Blocks,
  FileText,
  Network,
} from "lucide-react"
import { Suspense } from "react"
import Link from "next/link"
import { FetchAdmin } from "./fetch-admin"

const navLinks = [
  { href: "/admin", label: "Manage Users", icon: Users },
  { href: "/admin/company", label: "Company", icon: Building },
  { href: "/admin/positions", label: "Positions", icon: Briefcase },
  { href: "/admin/departments", label: "Departments", icon: Blocks },
  { href: "/admin/leaves", label: "Leaves Settings", icon: FileText },
  { href: "/admin/organization", label: "Organization", icon: Network },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          {navLinks.map((link) => (
            <SidebarMenu key={link.href}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={link.href}>
                    <link.icon />
                    {link.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ))}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div>Loading...</div>}>
          <FetchAdmin />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  )
}
