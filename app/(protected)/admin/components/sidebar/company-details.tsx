import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { getSignedURLForLogo } from "../../company/components/actions"

export async function CompanyLogo() {
  const supabase = await createClient()
  const { data: admin } = await supabase.auth.getUser()
  const { data: company } = await supabase
    .from("administrators")
    .select("company_id")
    .eq("user_id", admin?.user?.id)
    .single()
  const { data: companyDetails } = await supabase
    .from("company")
    .select("logo, name")
    .eq("id", company?.company_id)
    .single()

  const logoURL = await getSignedURLForLogo({ filePath: companyDetails?.logo })

  return (
    <Avatar className="rounded-lg after:rounded-lg after:border-0">
      <AvatarImage
        src={logoURL?.signedUrl || ""}
        className="rounded-lg object-contain"
      />
      <AvatarFallback className="rounded-lg">
        {companyDetails?.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export async function CompanyName() {
  const supabase = await createClient()
  const { data: admin } = await supabase.auth.getUser()
  const { data: company } = await supabase
    .from("administrators")
    .select("company_id")
    .eq("user_id", admin?.user?.id)
    .single()
  const { data: companyDetails } = await supabase
    .from("company")
    .select("logo, name")
    .eq("id", company?.company_id)
    .single()

  return <span>{companyDetails?.name}</span>
}
