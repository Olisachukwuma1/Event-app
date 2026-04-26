'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function AuthCode() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`,
        { code },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      localStorage.setItem('token', res.data.token)
      router.push('/dashboard')
    } catch (_err) {
      toast.error('Invalid or expired code')
    }
  }

  const handleResend = async () => {
    setError('')
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-code`,
        {},
        { headers: { Authorization: 'Bearer ' + token } }
      )
      toast.success('Code resent! Check your email.')
    } catch (_err) {
      toast.error('Could not resend code. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          Authentication Code
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Check your email and enter the code below
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter 6-Digit Authentication Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            className="border text-black border-gray-300 rounded-lg px-4 py-2 text-sm text-center tracking-widest focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleResend}
          className="mt-4 w-full text-center text-sm text-gray-600 hover:text-blue-600 transition"
        >
          Resend Authentication Code
        </button>
      </div>
    </div>
  )
}