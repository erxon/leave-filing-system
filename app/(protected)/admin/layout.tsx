import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import SiteHeader from "@/components/site-header"
import { AdminSidebar } from "./components/sidebar/admin-sidebar"
import AdminClientProvider from "./context/admin-client-provider"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  const { data: admin } = await supabase
    .from("administrators")
    .select("*")
    .eq("user_id", data?.user?.id)
    .single()

  if (!admin) {
    redirect("/unauthorized")
  }

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
