
"use client"

import { signIn } from "next-auth/react"
 
export default function SignIn() {
  return (
    <button
      type="button"
      className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Mit Google anmelden
    </button>
  )
}
