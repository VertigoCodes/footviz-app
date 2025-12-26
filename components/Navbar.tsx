'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  const isAdmin = session?.user && (session.user as any).role === 'admin'

  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center gap-4">
        <Link href="/players" className="font-medium">
          Players
        </Link>

        {isAdmin && (
          <Link href="/admin/add-player" className="font-medium">
            Add Player
          </Link>
        )}

        <div className="ml-auto">
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-sm text-gray-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
