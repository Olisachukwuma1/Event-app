'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/')
      return
    }

    try {
      const decoded = jwtDecode(token)
      const isExpired = decoded.exp * 1000 < Date.now()
      if (isExpired) {
        localStorage.removeItem('token')
        router.push('/')
        return
      }
      setAuthorized(true)
    } catch (_err) {
      localStorage.removeItem('token')
      router.push('/')
    }
  }, [router])

  if (!authorized) return null

  return children
}