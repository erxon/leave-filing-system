"use client"

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
import { FilePlus, History, Calendar, LogOut, Gauge } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import LeaveFilingForm from "../leave-filing/ui/leave-filing-form"

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
]

export function EmployeeSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
              <SidebarMenuButton tooltip={"Logout"}>
                <LogOut /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <LeaveFilingForm open={isOpen} setOpen={setIsOpen} />
    </>
  )
}
