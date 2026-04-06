import { useState, useEffect } from 'react'
import axios from 'axios'
import EventCard from '../components/EventCard'

function FrontendEvents() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/public`)
        setEvents(res.data)
      } catch (err) {
        console.error('Failed to fetch events',err)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-center text-blue-600 tracking-wide mb-8">
        Upcoming Events
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm col-span-4 text-center">
            No events found
          </p>
        ) : (
          events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </div>
  )
}

export default FrontendEvents

