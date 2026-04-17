'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'


export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const linkClass = (path) =>
    `px-4 py-3 text-sm transition hover:bg-gray-800 ${
      pathname === path ? 'bg-gray-800 text-white' : 'text-gray-400'
    }`

  return (
    <div className="w-44 min-h-screen bg-black text-white flex flex-col">
      <div className="px-4 py-5 text-base font-semibold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex flex-col mt-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>
        <Link href="/events/manage_events" className={linkClass('/events/manage_events')}>
          Manage Events
        </Link>
        
        <Link href="/administrators" className={linkClass('/administrators')}>
          Administrators
        </Link>
        <button
          onClick={handleSignOut}
          className="px-4 py-3 text-sm text-left text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          Sign Out
        </button>
      </nav>
    </div>
  )
}