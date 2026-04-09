import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Discover Amazing Events
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Find and explore upcoming events in your city. From tech conferences
          to cultural fairs — there is something for everyone.
        </p>
        <Link
          href="/events"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-medium transition"
        >
          Browse Events
        </Link>
      </div>

      {/* Features section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 pb-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="text-base text-gray-800 font-semibold mb-2">Upcoming Events</h3>
          <p className="text-sm text-gray-500">
            Stay up to date with the latest events happening around you.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-3">📍</div>
          <h3 className="text-base text-gray-800 font-semibold mb-2">Multiple Venues</h3>
          <p className="text-sm text-gray-500">
            Events happening online and at physical locations near you.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-3">🎉</div>
          <h3 className="text-base text-gray-800 font-semibold mb-2">All Categories</h3>
          <p className="text-sm text-gray-500">
            Tech, culture, business, entertainment and more.
          </p>
        </div>
      </div>

    </div>
  )
}