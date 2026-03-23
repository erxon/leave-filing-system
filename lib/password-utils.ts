"use client"

export const passwordRequirements = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "Contains a number", test: (pw: string) => /\d/.test(pw) },
  {
    label: "Contains an uppercase letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "Contains a lowercase letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    label: "Contains a special character",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
]

export function getPasswordStrength(password: string) {
  if (!password) return 0
  return passwordRequirements.filter((req) => req.test(password)).length
}

export function getStrengthDetails(strength: number) {
  if (strength === 0) return { text: "", color: "" }
  if (strength <= 2) return { text: "Weak", color: "bg-destructive", textColor: "text-destructive" }
  if (strength <= 4) return { text: "Medium", color: "bg-yellow-500", textColor: "text-yellow-500" }
  return { text: "Strong", color: "bg-green-500", textColor: "text-green-500" }
}
