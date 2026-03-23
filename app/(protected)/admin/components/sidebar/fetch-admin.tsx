"use client"

import { NavAdminUser } from "./nav-admin-user"
import { useAdminData } from "../../context/admin-client-provider"

export function FetchAdmin() {
  const { data: admin, isLoading, isError, error } = useAdminData()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error {error.message}</div>
  }

  return <NavAdminUser adminData={admin} />
}
