"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    const supabase = createClient()
    e.preventDefault()

    // Convert ID to Shadow Email
    const shadowEmail = `${employeeId.toLowerCase()}@internal.hr-system.com`

    const { data, error } = await supabase.auth.signInWithPassword({
      email: shadowEmail,
      password: password,
    })

    if (error) {
      toast.error("Invalid Employee ID or Password")
    }

    if (data) {
      toast.success("Login successful")

      // Get employee data
      const { data: employee, error: employeeError } = await supabase
        .from("employee_profiles")
        .select("*")
        .eq("id", data.user?.id)
        .single()

      if (employeeError) throw employeeError

      // Redirect to appropriate page based on role
      if (!employee.is_password_reset) {
        router.push("/auth/reset-password")
      } else {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your employee ID below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input
                  id="employee_id"
                  type="employee_id"
                  placeholder="1234567"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
