'use client'

import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import axios from 'axios'

export default function EventBanner() {
  const [events, setEvents] = useState([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/public`
        )
        setEvents(res.data)
      } catch (err) {
        console.error('Failed to fetch events', err)
      }
    }
    fetchEvents()
  }, [])

  // Auto slide every 3 seconds
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 3000)
    return () => clearInterval(interval)
  }, [emblaApi])

  if (events.length === 0) return null

  return (
    <div className="overflow-hidden relative" ref={emblaRef}>
      <div className="flex">
        {events.map((event) => (
          <div
            key={event._id}
            className="relative flex-none w-full h-96"
          >
            {event.photo ? (
              <img
                src={event.photo}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-6">
              <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
              <p className="text-sm mb-1">📅 {event.date}</p>
              <p className="text-sm mb-1">🕐 {event.time}</p>
              <p className="text-sm">📍 {event.venue}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="w-2 h-2 rounded-full bg-white opacity-60 hover:opacity-100 transition"
          />
        ))}
      </div>
    </div>
  )
}