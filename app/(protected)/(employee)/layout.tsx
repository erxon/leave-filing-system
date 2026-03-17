import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EmployeeSidebar } from "./components/sidebar/employee-sidebar"
import SiteHeader from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Layout({ children }: { children: React.ReactNode }) {
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
