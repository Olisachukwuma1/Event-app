'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import socket from '../../socket'
import Navbar from '../../components/Navbar'
import EventCard from '../../components/EventCard'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/public`
      )
      setEvents(res.data)
    } catch (err) {
      console.error('Failed to fetch events', err)
    } finally {
      setLoading(false)
    }
  }

  fetchEvents()

  socket.on('connect', () => {
    console.log('Connected to socket:', socket.id)
    fetchEvents() // 👈 ensures no missed events
  })

  socket.on('newEvent', (newEvent) => {
    console.log('New event received:', newEvent.title)
    setEvents((prev) => [newEvent, ...prev])
  })

  return () => {
    socket.off('newEvent')
    socket.off('connect')
  }
}, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-8 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-2">
          Upcoming Events
        </h1>
        <p className="text-center text-gray-500 text-sm mb-10">
          Browse all upcoming events
        </p>

        {loading ? (
          <p className="text-center text-gray-400 text-sm">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No events found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}