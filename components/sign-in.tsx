
"use client"

import { signIn } from "next-auth/react"
 
export default function SignIn() {
  return (
    <button className="p-2 bg-blue-400"
      onClick={() => signIn("google")}>Mit Google einloggen
    </button>)
}
