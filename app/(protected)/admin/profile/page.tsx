import AdminProfile from "./admin-profile"
import { getAdminProfile } from "./actions"

export default async function Page() {
  const admin = await getAdminProfile()
  return <AdminProfile admin={admin} />
}
