"use client"

import { createClient } from "@/lib/supabase/client"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function AdminClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export function useAdminData() {
  return useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("administrators")
        .select("*")
        .eq("user_id", user?.id)
        .single()

      if (error) throw new Error(error.message)
      return data
    },
  })
}
