"use client"

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
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { completePasswordReset } from "./actions"
import { PasswordStrength } from "@/components/auth/password-strength"
import { getPasswordStrength, passwordRequirements } from "@/lib/password-utils"

export default function ResetPasswordForm({
  employeeId,
  name,
}: {
  employeeId: string
  name: string
}) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const strength = getPasswordStrength(password)
  const isPasswordValid = strength === passwordRequirements.length
  const passwordsMatch = password === confirmPassword && password !== ""

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid || !passwordsMatch) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: password,
      })

      if (authError) throw authError

      const result = await completePasswordReset()
      if (result.error) throw new Error(result.error)

      toast.success("Password reset successful")
      router.push("/dashboard")
    } catch (error) {
      toast.error((error as Error).message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div>
      <Card className="border-none bg-background/60 shadow-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="space-y-1">
              <p className="text-sm font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">{employeeId}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Logout
            </Button>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 focus-visible:ring-primary"
                  placeholder="••••••••"
                />

                <PasswordStrength password={password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "bg-muted/30 focus-visible:ring-primary",
                    confirmPassword &&
                      !passwordsMatch &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder="••••••••"
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="flex items-center gap-1 text-[10px] font-medium text-destructive">
                    <ShieldAlert className="size-3" /> Passwords do not match
                  </p>
                )}
                {passwordsMatch && (
                  <p className="flex items-center gap-1 text-[10px] font-medium text-green-500">
                    <ShieldCheck className="size-3" /> Passwords match
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={!isPasswordValid || !passwordsMatch || isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
