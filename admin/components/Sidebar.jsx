'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  MdDashboard,
  MdEvent,
  MdViewCarousel,
  MdPeople,
  MdLogout,
  MdPublic,
} from 'react-icons/md'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-800 ${
      pathname === path ? 'bg-gray-800 text-white' : 'text-gray-400'
    }`

  return (
    <div className="w-52 min-h-screen bg-black text-white flex flex-col">
      <div className="px-4 py-5 text-base font-semibold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex flex-col mt-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          <MdDashboard size={18} />
          Dashboard
        </Link>
        <Link href="/sliders" className={linkClass('/sliders')}>
          <MdViewCarousel size={18} />
          Manage Sliders
        </Link>
        <Link href="/events/manage_events" className={linkClass('/events/manage_events')}>
          <MdEvent size={18} />
          Manage Events
        </Link>
        <Link href="/administrators" className={linkClass('/administrators')}>
          <MdPeople size={18} />
          Administrators
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-sm text-left text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <MdLogout size={18} />
          Sign Out
        </button>
      </nav>
    </div>
  )
}