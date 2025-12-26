import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-5xl mx-auto p-4 flex gap-4">
        <Link href="/players" className="font-medium">
          Players
        </Link>

        <Link href="/admin/add-player" className="font-medium">
          Add Player
        </Link>
      </div>
    </nav>
  )
}
