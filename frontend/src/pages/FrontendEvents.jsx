import { useState, useEffect } from 'react'
import axios from 'axios'
import EventCard from '../components/EventCard'

function FrontendEvents() {
  const [events, setEvents] = useState([


     {
        _id: '1',
        title: 'Kaduna Buy and Sell Fair',
        date: '25-04-2026',
        time: '10:00 AM',
        venue: 'Murtala Square',
        photo:'/tradefair.jpg',
      },
      {
        _id: '2',
        title: 'Techie Conference 2026',
        date: '23-04-2026',
        time: '14:00 PM',
        venue: 'Cafe-One',
        photo: '/Tech Conference.jpg',
      },
      {
        _id: '3',
        title: 'Wonderland Enchanted Carnival',
        date: '30-04-2026',
        time: '11:00 AM',
        venue: 'Murtala Square',
        photo:'/carnival.jpg' ,
      },
      {
        _id: '4',
        title: 'Vibez Corner',
        date: '05-05-2026',
        time: '21:00 PM',
        venue: 'Dera-classic, Narayi high-cost',
        photo: '/rave.jpg',
      },
  ])

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

