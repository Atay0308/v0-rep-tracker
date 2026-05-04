"use client"
import { useSession } from "next-auth/react"
import SignIn from "../sign-in"
import SignOut from "../sign-out"

export default function UserMenu() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Lädt...</p>

  return (
    <div>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}!</p>
          <SignOut />
        </>
      ) : (
        <>
            <p>Nicht eingeloggt</p>
            <SignIn />
        </>
      )}
    </div>
  )
}