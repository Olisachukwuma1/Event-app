'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import EventCard from '../components/EventCard'
import EventBanner from '../components/EventBanner'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/public`
        )
        setEvents(res.data)
        setError(false)
      } catch (err) {
        console.error('Failed to fetch events', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 10000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Unable to load events. Check your network connection.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. TOP SECTION: Heading and Subtext */}
      <div className="pt-10 pb-6 px-8">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-2">
          Upcoming Events
        </h1>
        
      </div>

      {/* 2. MIDDLE SECTION: The Banner Slider */}
      <EventBanner />

      {/* 3. BOTTOM SECTION: The Event Cards Grid */}
      <div className="px-8 py-10 max-w-7xl mx-auto">
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