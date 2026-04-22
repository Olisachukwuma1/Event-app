import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 md:px-6 py-3 flex items-center w-full">

      {/* LEFT: Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="EventApp logo"
          width={100}
          height={40}
          className="object-contain"
        />
      </div>

      {/* CENTER: Title */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg md:text-3xl font-semibold text-blue-600">
        Upcoming Events
      </h1>

    </nav>
  )
}