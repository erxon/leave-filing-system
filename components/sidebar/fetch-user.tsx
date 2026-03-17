import { NavUser } from "./nav-user"
import { getEmployee } from "@/app/auth/actions"

export default async function FetchUser() {
  const employee = await getEmployee()

  return (
    <NavUser
      user={{
        employee_id: employee?.employee_id,
        name: {
          first_name: employee?.first_name,
          last_name: employee?.last_name,
        },
        avatar: employee?.avatar_url || "",
      }}
    />
  )
}
