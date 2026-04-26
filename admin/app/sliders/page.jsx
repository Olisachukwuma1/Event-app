'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import { FaTrash, FaEdit } from 'react-icons/fa'
import ProtectedRoute from '../../components/ProtectedRoute'
import { toast } from 'react-toastify'

export default function Sliders() {
  const [sliders, setSliders] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sliders`,
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setSliders(res.data)
    } catch (_err) {
    
      toast.error('Failed to load sliders')
    }
  }

  useEffect(() => {
    fetchSliders()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/` + id,
        { headers: { Authorization: 'Bearer ' + token } }
      )
      toast.success('Slider deleted successfully')
      fetchSliders()
    } catch (_err) {
      toast.error('Failed to delete slider')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-gray-600 font-semibold">Manage Sliders</h1>
            <button
              onClick={() => router.push('/sliders/add')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              + Add Slider
            </button>
          </div>

          {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="mb-3">
            <span className="text-sm text-gray-600">
              Total Records: {sliders.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Slider Title</th>
                  <th className="text-left px-4 py-3">Added Date</th>
                  <th className="text-left px-4 py-3">Expiry Date</th>
                  <th className="text-left px-4 py-3">Slider Images</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sliders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No sliders found
                    </td>
                  </tr>
                ) : (
                  sliders.map((slider) => (
                    <tr key={slider._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-600">
                        {slider._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{slider.title}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(slider.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                      </td>
                      <td className="px-4 py-3">
                        {slider.expiresAt ? (
                          <span className={
                            new Date(slider.expiresAt) < new Date()
                              ? 'text-red-500'
                              : 'text-gray-600'
                          }>
                            {new Date(slider.expiresAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                          </span>
                        ) : (
                          <span className="text-gray-400">No expiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-4 items-center">
                        {slider.desktopImage ? (
                          <button
                            onClick={() => window.open(slider.desktopImage, '_blank')}
                            className="text-blue-600 hover:underline"
                          >
                            View Desktop
                          </button>
                        ) : (
                          <span className="text-gray-300">No Desktop</span>
                        )}
                        {slider.mobileImage ? (
                          <button
                            onClick={() => window.open(slider.mobileImage, '_blank')}
                            className="text-blue-600 hover:underline"
                          >
                            View Mobile
                          </button>
                        ) : (
                          <span className="text-gray-300">No Mobile</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => router.push('/sliders/add?id=' + slider._id)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(slider._id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {/* Empty rows like in mockup */}
                {sliders.length < 6 && Array.from({ length: 6 - sliders.length }).map((_, i) => (
                  <tr key={'empty-' + i} className="border-t border-gray-100">
                    <td className="px-4 py-3">&nbsp;</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}