"use client"
import { signOut } from "next-auth/react"
 
export default function SignOut() {
  return (
    <button className= "p-2 bg-blue-400"
      onClick={() => signOut()}>Ausloggen
    </button>
  )
}