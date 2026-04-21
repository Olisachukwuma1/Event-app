'use client'

import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import axios from 'axios'


const DEFAULT_SLIDES = [
  {
    id: 1,
    desktop: 'images/artshow-desktop.png',
    mobile: 'images/artshow-mobile.png',
    title: 'Experience Unforgettable Moments',
    subtitle: 'Discover the best events in Kaduna and beyond',
    link: '/events'
  },
  {
    id: 2,
    desktop: 'images/party-desktop.png',
    mobile: 'images/party-mobile.png',
    title: 'Connect with the Community',
    subtitle: 'From tech meetups to local festivals',
    link: '/events'
  },
  {
    id: 3,
    desktop: 'images/football-desktop.png',
    mobile: 'images/football-mobile.png',
    title: 'Learn. Network. Grow.',
    subtitle: 'Join workshops that sharpen your skills',
    link: '/events'
  }
]

export default function EventBanner() {
  const [sliders, setSliders] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    // Fetch active sliders from backend
    const fetchSliders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/public`
        )
        setSliders(res.data)
      } catch (err) {
        console.error('Failed to fetch sliders', err)
      }
    }
    fetchSliders()

    // Check screen size
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto slide every 4 seconds
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [emblaApi])

  // Use real sliders if available otherwise use default slides
  const useDefault = sliders.length === 0

  const slides = useDefault
    ? DEFAULT_SLIDES.map(s => ({
        _id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        desktopImage: s.desktop,
        mobileImage: s.mobile,
        link: s.link,
      }))
    : sliders

  return (
    <div className="overflow-hidden relative shadow-lg" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide) => {
          const imageUrl = isMobile
            ? (slide.mobileImage || slide.desktopImage)
            : (slide.desktopImage || slide.mobileImage)

          return (
            <div
              key={slide._id}
              className="relative flex-none w-full h-[500px] md:h-[600px]"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center text-white text-center px-6">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl font-medium opacity-90 mb-6">
                    {slide.subtitle}
                  </p>
                )}
              
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
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