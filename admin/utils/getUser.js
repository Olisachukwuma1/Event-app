import { jwtDecode } from 'jwt-decode'


const getUser = () => {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decoded = jwtDecode(token)

    // 🔥 check expiry
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      return null
    }

    return decoded
  } catch {
    return null
  }
}