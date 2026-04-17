'use client'

import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

// Define your random slide data here
const BANNER_SLIDES = [
  {
    id: 1,
    image: 'images/emerson-vieira-gOQ_57KsJKM-unsplash.jpg',
    title: 'Experience Unforgettable Moments',
    subtitle: 'Discover the best events in Kaduna and beyond'
  },
  {
    id: 2,
    image: 'images/party.jpg',
    title: 'Connect with the Community',
    subtitle: 'From tech meetups to local festivals'
  },
  {
    id: 3,
    image: 'images/art-show.jpg',
    title: 'Learn. Network. Grow.',
    subtitle: 'Join workshops that sharpen your skills'
  }
]

export default function EventBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  // Auto slide logic
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000) // 4 seconds is a better pace for reading text
    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <div className="overflow-hidden relative shadow-lg" ref={emblaRef}>
      <div className="flex">
        {BANNER_SLIDES.map((slide) => (
          <div key={slide.id} className="relative flex-none w-full h-[450px]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Dark Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center text-white text-center px-6">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl font-medium opacity-90">
                {slide.subtitle}
              </p>
              <button className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition transform hover:scale-105">
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {BANNER_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition"
          />
        ))}
      </div>
    </div>
  )
}