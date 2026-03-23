import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import SiteHeader from "@/components/site-header"
import { AdminSidebar } from "./components/sidebar/admin-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Unauthorized from "@/components/unauthorized"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: administrator, error: administratorError } = await supabase
    .from("administrators")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  if (!administrator || administratorError) {
    return <Unauthorized />
  }

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
