"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { passwordRequirements, getPasswordStrength, getStrengthDetails } from "@/lib/password-utils"

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const strength = getPasswordStrength(password)
  const { text, color, textColor } = getStrengthDetails(strength)

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">
          Strength: <span className={cn(textColor)}>{text}</span>
        </span>
        <span>
          {strength}/{passwordRequirements.length}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full transition-all duration-500 ease-out", color)}
          style={{
            width: `${(strength / passwordRequirements.length) * 100}%`,
          }}
        />
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-1.5">
        {passwordRequirements.map((req, i) => {
          const isMet = req.test(password)
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                isMet
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              )}
            >
              {isMet ? (
                <Check className="size-3.5" />
              ) : (
                <X className="size-3.5 opacity-50" />
              )}
              {req.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
