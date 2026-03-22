import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import SiteHeader from "@/components/site-header"
import { AdminSidebar } from "./components/sidebar/admin-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="px-8 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
