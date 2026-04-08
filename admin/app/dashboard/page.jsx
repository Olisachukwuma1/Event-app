'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import { jwtDecode } from 'jwt-decode'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setUser(decoded)
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
          headers: { Authorization: 'Bearer ' + token },
        })
        setEvents(res.data)
      } catch (err) {
        console.error('Failed to fetch events', err)
      }
    }
    fetchEvents()
  }, [])

  return (
    <ProtectedRoute>
            <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <span className="text-sm text-blue-600">
            Welcome, {user?.name || 'Admin'}
          </span>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total Events</p>
            <p className="text-3xl font-semibold text-blue-600">
              {events.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Upcoming Events</p>
            <p className="text-3xl font-semibold text-green-600">
              {events.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Online Events</p>
            <p className="text-3xl font-semibold text-purple-600">
              {events.filter((e) => e.venue.toLowerCase() === 'online').length}
            </p>
          </div>
        </div>

        {/* Recent events */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold mb-4">Recent Events</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-left px-4 py-3 rounded-tl-lg">Event Title</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3 rounded-tr-lg">Venue</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{event.title}</td>
                    <td className="px-4 py-3">{event.date}</td>
                    <td className="px-4 py-3">{event.time}</td>
                    <td className="px-4 py-3">{event.venue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
    </ProtectedRoute>

  )
}