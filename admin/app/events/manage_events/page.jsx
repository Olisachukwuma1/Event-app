'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Sidebar from '../../../components/Sidebar'
import EventTable from '../../../components/EventTable'
import { jwtDecode } from 'jwt-decode'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function ManageEvents() {
  const [events, setEvents] = useState([])
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setUser(decoded)
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
          { headers: { Authorization: 'Bearer ' + token } }
        )
        setEvents(res.data)
      } catch (_err) {
        setMessage('Failed to load events')
      }
    }
    fetchEvents()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/` + id,
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setMessage('Event deleted successfully')
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setEvents(res.data)
    } catch (_err) {
      setMessage('Failed to delete event')
    }
  }

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-gray-800 font-semibold">Manage Event</h1>
          <span className="text-sm text-blue-600">
            Welcome, {user?.name || 'Admin'}
          </span>
        </div>

        {message && (
          <p className="text-green-600 text-sm mb-3">{message}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-800 text-gray-500">
            Total Records: {events.length}
          </span>
          <button
            onClick={() => router.push('/events/add_event')}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            + Add Event
          </button>
        </div>

        <EventTable events={events} onDelete={handleDelete} />

      </div>
    </div>
    </ProtectedRoute>
  )
}