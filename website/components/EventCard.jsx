// 👇 ADD THIS HERE (top of file)
const formatDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};
export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
      {event.photo ? (
        <img
          src={event.photo}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      ) : (
        <div className="w-full h-48 rounded-t-2xl bg-gradient-to-br from-blue-400 to-purple-500" />
      )}
      <div className="p-4">
        <h2 className="text-base text-gray-800 font-semibold mb-3">{event.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-gray-800">Date: </span>
         {formatDate(event.date)}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-gray-800">Time: </span>
          {event.time}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Venue: </span>
          {event.venue}
        </p>
      </div>
    </div>
  )
}