import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// For modern browsers and Node.js (with 'crypto' module import in Node)
export function generateSecureRandomAlphanumeric(length: number) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+_"
  let result = ""
  // Create a Uint8Array with the specified length
  const values = new Uint8Array(length)
  // Fill it with cryptographically secure random values
  crypto.getRandomValues(values)

  for (let i = 0; i < length; i++) {
    // Use modulo to map the random byte (0-255) to a character in the charset
    result += charset[values[i] % charset.length]
  }
  return result
}
