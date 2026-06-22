"use client"
import { signOut } from "next-auth/react"
 
export default function SignOut() {
  return (
    <button className= "p-2 mt-4 px-5 bg-blue-400"
      onClick={() => signOut()}>Ausloggen
    </button>
  )
}