'use client'

import { useRouter } from 'next/navigation'
import { FaTrash } from 'react-icons/fa'

export default function EventTable({ events, onDelete }) {
  const router = useRouter()

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm bg-white">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="text-left  px-4 py-3">Event Title</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left  px-4 py-3">Time</th>
            <th className="text-left  px-4 py-3">Venue</th>
            <th className="text-left  px-4 py-3">Event Photo</th>
            <th className="text-left  px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-black-400">
                No events found
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event._id} className="border-t border-gray-100">
                <td className="px-4 text-gray-800 py-3">{event.title}</td>
                <td className="px-4text-gray-800 py-3">{event.date}</td>
                <td className="px-4 text-gray-800 py-3">{event.time}</td>
                <td className="px-4 text-gray-800 py-3">{event.venue}</td>
                <td className="px-4 text-gray-800 py-3">
                  {event.photo ? (
                    <button
                      onClick={() => window.open(event.photo, '_blank')}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-300">None</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-3 items-center">
                  <button
                    onClick={() => router.push(`/events/add_event?id=${event._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(event._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}