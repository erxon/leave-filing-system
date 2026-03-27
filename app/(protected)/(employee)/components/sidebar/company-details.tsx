import { getSignedURLForLogo } from "@/app/(protected)/admin/company/components/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { Building } from "lucide-react"
import Link from "next/link"

export default async function CompanyDetails() {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("*")
    .eq("id", user?.user?.id)
    .single()

  const { data: company } = await supabase
    .from("company")
    .select("*")
    .eq("id", employee?.company_id)
    .single()

  const path = company?.logo?.includes("logos/")
    ? company?.logo.split("logos/").pop()
    : company?.logo

  let companyLogo = null
  if (path) {
    const { data } = await supabase.storage
      .from("logos")
      .createSignedUrl(path, 60)
    companyLogo = data?.signedUrl
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size={"lg"}>
          <Link href={"/dashboard"}>
            <Avatar className="rounded-lg after:rounded-lg after:border-0">
              {companyLogo && (
                <AvatarImage
                  className="rounded-lg object-contain"
                  src={companyLogo}
                />
              )}
              <AvatarFallback className="rounded-lg">
                {company?.name?.charAt(0) || <Building />}
              </AvatarFallback>
            </Avatar>
            <p>{company?.name || "Company"}</p>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
