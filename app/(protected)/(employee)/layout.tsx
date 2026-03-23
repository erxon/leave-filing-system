import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EmployeeSidebar } from "./components/sidebar/employee-sidebar"
import SiteHeader from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single()

  if (!employee) redirect("/auth/login")

  if (!employee.is_password_reset) redirect("/auth/reset-password")

  return (
    <SidebarProvider>
      <TooltipProvider>
        <EmployeeSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="px-4 py-8 md:px-16">{children}</main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  )
}
