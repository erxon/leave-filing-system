import { createClient } from "@/lib/supabase/server"
import Unauthorized from "@/components/unauthorized"
import { redirect } from "next/navigation"
import { getEmployee } from "../../../components/user-creation/actions"
import EditUserForm from "../../../components/user-creation/ui/edit-user"

export default async function Page(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const id = params.id

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

  const employee = await getEmployee(id)
  const manager_name = employee.manager 
    ? `${employee.manager.first_name} ${employee.manager.last_name}`
    : "N/A"

  return (
    <div className="container mx-auto py-10">
      <EditUserForm 
        employee={{...employee, manager_name}} 
        company_id={administrator.company_id} 
      />
    </div>
  )
}
