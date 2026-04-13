'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Sidebar from '../../../components/Sidebar'
import { Suspense } from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'

function AddEventForm() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  useEffect(() => {
    if (editId) {
      const fetchEvent = async () => {
        try {
          const token = localStorage.getItem('token')
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/events/` + editId,
            { headers: {Authorization: `Bearer ${token}`} }
          )
          const e = res.data
          setTitle(e.title)
          setDate(e.date)
          setTime(e.time)
          setVenue(e.venue)
          if (e.photo) setPreview(e.photo)
        } catch (_err) {
          setError('Failed to load event')
        }
      }
      fetchEvent()
    }
  }, [editId])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', title)
      formData.append('date', date)
      formData.append('time', time)
      formData.append('venue', venue)
      if (photo) formData.append('photo', photo)

      if (editId) {
     await axios.put(
  `${process.env.NEXT_PUBLIC_API_URL}/api/events/` + editId,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  }
)
  setMessage('Event updated successfully')
      } 
      else {
      await axios.post(
       `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
          formData,
      {
         headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }
  }
)
        setMessage('Event has been added successfully')
      }

      setTimeout(() => router.push('/events/manage_events'), 1500)
    } catch (_err) {
      setError('Failed to save event. Please try again.')
    }
  }

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl text-gray-800 font-semibold">
            {editId ? 'Edit Event' : 'Add Event'}
          </h1>
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mt-4">
              Fill in the form to {editId ? 'update the' : 'add a new'} event.
            </p>
            <button
              onClick={() => router.push('/events/manage_events')}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Back to Manage Events
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-80 flex-shrink-0">
            <h2 className="text-base text-gray-800 font-semibold text-center mb-4">
              {editId ? 'Edit Event' : 'Add Event'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Event Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                  className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
<label
  htmlFor="photoInput"
  className="border border-dashed border-gray-300 rounded-lg h-28 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition"
>
  {preview ? (
    <img
      src={preview}
      alt="preview"
      className="h-full w-full object-cover rounded-lg"
    />
  ) : (
    <span className="text-xs text-gray-400 text-center px-2">
       Add event photo here 
    </span>
  )}
</label>

<input
  type="file"
  accept="image/*"
  id="photoInput"
  onChange={handlePhotoChange}
  className="hidden"
/>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition"
              >
                {editId ? 'Update Event' : 'Add Event'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default function AddEvent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddEventForm />
    </Suspense>
  )
}