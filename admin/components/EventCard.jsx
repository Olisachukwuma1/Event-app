export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
     {event.photo ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${event.photo.replace(/\\/g, '/')}`}
    alt={event.title}
    className="w-full h-48 object-cover rounded-t-2xl"
  />
) : (
  <div className="w-full h-48 rounded-t-2xl bg-gradient-to-br from-blue-400 to-purple-500" />
)}
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-3">{event.title}</h2>
        <p className="text-xs text-black-500 mb-1">
          <span className="font-medium text-black-700">Date: </span>
          {event.date}
        </p>
        <p className="text-xs text-black-500 mb-1">
          <span className="font-medium text-black-700">Time: </span>
          {event.time}
        </p>
        <p className="text-xs text-black-500">
          <span className="font-medium text-black-700">Venue: </span>
          {event.venue}
        </p>
      </div>
    </div>
  )
}