import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="w-44 min-h-screen bg-black text-white flex flex-col">
      <div className="px-4 py-5 text-base font-semibold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex flex-col mt-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-4 py-3 text-sm transition hover:bg-gray-800 ${
              isActive ? 'bg-gray-800 text-white' : 'text-gray-400'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/events/manage_events"
          className={({ isActive }) =>
            `px-4 py-3 text-sm transition hover:bg-gray-800 ${
              isActive ? 'bg-gray-800 text-white' : 'text-gray-400'
            }`
          }
        >
          Manage Events
        </NavLink>
        <NavLink
          to="/administrators"
          className={({ isActive }) =>
            `px-4 py-3 text-sm transition hover:bg-gray-800 ${
              isActive ? 'bg-gray-800 text-white' : 'text-gray-400'
            }`
          }
        >
          Administrators
        </NavLink>
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

export default Sidebar