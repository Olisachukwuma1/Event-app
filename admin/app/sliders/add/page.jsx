'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Sidebar from '../../../components/Sidebar'
import ProtectedRoute from '../../../components/ProtectedRoute'
import Image from 'next/image'

function AddSliderForm() {
  const [title, setTitle] = useState('')
  
  const [expiresAt, setExpiresAt] = useState('')
  const [desktopImage, setDesktopImage] = useState(null)
  const [mobileImage, setMobileImage] = useState(null)
  const [previewDesktop, setPreviewDesktop] = useState(null)
  const [previewMobile, setPreviewMobile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  useEffect(() => {
    if (editId) {
      const fetchSlider = async () => {
        try {
          const token = localStorage.getItem('token')
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/` + editId,
            { headers: { Authorization: 'Bearer ' + token } }
          )
          const s = res.data
          setTitle(s.title)
      
          if (s.expiresAt) {
            setExpiresAt(new Date(s.expiresAt).toISOString().split('T')[0])
          }
          if (s.desktopImage) setPreviewDesktop(s.desktopImage)
          if (s.mobileImage) setPreviewMobile(s.mobileImage)
        } catch (_err) {
          setError('Failed to load slider')
        }
      }
      fetchSlider()
    }
  }, [editId])

  const handleDesktopChange = (e) => {
    const file = e.target.files[0]
    setDesktopImage(file)
    setPreviewDesktop(URL.createObjectURL(file))
  }

  const handleMobileChange = (e) => {
    const file = e.target.files[0]
    setMobileImage(file)
    setPreviewMobile(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', title)
     
      formData.append('expiresAt', expiresAt)
      if (desktopImage) formData.append('desktopImage', desktopImage)
      if (mobileImage) formData.append('mobileImage', mobileImage)

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/` + editId,
          formData,
          { headers: { Authorization: 'Bearer ' + token } }
        )
        setMessage('Slider updated successfully')
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sliders`,
          formData,
          { headers: { Authorization: 'Bearer ' + token } }
        )
        setMessage('Slider added successfully')
      }

      setTimeout(() => router.push('/sliders'), 1500)
    } catch (_err) {
      setError('Failed to save slider. Please try again.')
    }
  }

  return (
    <div className="flex flex-col md:flex-row  min-h-screen">
      <Sidebar className="hidden md:block" />
      <div className="flex-1 bg-gray-100 p-6">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-gray-800 font-semibold">
            {editId ? 'Edit Slider' : 'Add Slider'}
          </h1>
          <button
            onClick={() => router.push('/sliders')}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Sliders
          </button>
        </div>

        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Title */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Slider Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg text-gray-600 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

          

            {/* Expiry Date */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Expiry Date (optional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full border border-gray-300 text-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Desktop Image */}
      <div>
  <label className="text-xs text-gray-600 mb-1 block font-medium">
    Desktop Banner
  </label>

  <div
    onClick={() => document.getElementById('desktopInput').click()}
    className="relative w-full rounded-xl overflow-hidden"
  >
    {previewDesktop ? (
      <>
        <img
          src={previewDesktop}
          alt="desktop preview"
          className="w-full h-auto "
        />

        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <p className="text-white text-lg font-semibold">
            Click to change
          </p>
        </div>
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Click to upload desktop banner
      </div>
    )}
  </div>

  <input
    type="file"
    accept="image/*"
    id="desktopInput"
    onChange={handleDesktopChange}
    className="hidden"
  />
</div>

            {/* Mobile Image */}
 <div>
  <label className="text-xs text-gray-600 mb-1 block font-medium">
    Mobile Banner
  </label>

  <div
    onClick={() => document.getElementById('mobileInput').click()}
    className="relative w-full rounded-xl overflow-hidden"
  >
    {previewMobile ? (
      <>
        <img
          src={previewMobile}
          alt="mobile preview"
          className="w-full h-auto "
        />

        <div className="absolute inset-0 bg-black/25 flex items-end p-3">
          <p className="text-white text-sm font-medium">
            Tap to change
          </p>
        </div>
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center px-2">
        Tap to upload mobile banner
      </div>
    )}
  </div>

  <input
    type="file"
    accept="image/*"
    id="mobileInput"
    onChange={handleMobileChange}
    className="hidden"
  />
</div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition"
            >
              {editId ? 'Update Slider' : 'Add Slider'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default function AddSlider() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <AddSliderForm />
      </Suspense>
    </ProtectedRoute>
  )
}