import { jwtDecode } from 'jwt-decode'

const getUser = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch (_err) {
    console.error(_err)
    return null
  }
}

export default getUser