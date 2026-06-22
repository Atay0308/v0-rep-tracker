"use client"
import { useSession } from "next-auth/react"
import SignIn from "../sign-in"
import SignOut from "../sign-out"
/**
 * Component for displaying user information and authentication status in the sidebar.
 * Shows a welcome message and sign-out option if the user is logged in, or a sign-in prompt if not.
 */
export default function UserMenu() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Lädt...</p>

  return (
    <div className="flex flex-col items-center justify-center text-center">
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