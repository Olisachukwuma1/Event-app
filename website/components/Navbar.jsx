import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-blue-600">EventApp</div>
      <div className="flex gap-6">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-blue-600 transition"
        >
          Home
        </Link>
        <Link
          href="/events"
          className="text-sm text-gray-600 hover:text-blue-600 transition"
        >
          Events
        </Link>
      </div>
    </nav>
  )
}