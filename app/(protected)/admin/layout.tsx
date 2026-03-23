import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import SiteHeader from "@/components/site-header"
import { AdminSidebar } from "./components/sidebar/admin-sidebar"
import AdminClientProvider from "./context/admin-client-provider"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminClientProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="px-8 py-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminClientProvider>
  )
}
