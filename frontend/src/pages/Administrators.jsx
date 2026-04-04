import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { RiDeleteBin6Line } from "react-icons/ri";

function Administrators() {
  const [admins, setAdmins] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/auth/admins', {
        headers: { Authorization: 'Bearer ' + token },
      })
      setAdmins(res.data)
    } catch (_err) {
        console.error(_err)
      setError('Failed to load admins')
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setMessage('Admin created successfully')
      setName('')
      setEmail('')
      setPassword('')
      fetchAdmins()
    } catch (_err) {
      setError(_err.response?.data?.message || 'Failed to create admin')
    }
  }

  //admindelete
const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this admin?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete('http://localhost:5000/api/auth/admins/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    })
    setMessage('Admin deleted successfully')
    fetchAdmins()
  } catch (_err) {
    console.error(_err)
    setError('Failed to delete admin')
  }
}


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">

        <h1 className="text-xl font-semibold mb-6">Administrators</h1>

        <div className="flex gap-6">

          {/* Admin list */}
          <div className="flex-1">
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm bg-white">
              <thead>
  <tr className="bg-blue-600 text-white">
    <th className="text-left px-4 py-3">Name</th>
    <th className="text-left px-4 py-3">Email</th>
    <th className="text-left px-4 py-3">Created</th>
    <th className="text-left px-4 py-3">Action</th>
  </tr>
    </thead>
     <tbody>
     {admins.length === 0 ? (
        <tr>
        <td colSpan="4" className="text-center py-6 text-gray-400">
         No admins found
        </td>
        </tr>
        ) : (
        admins.map((admin) => (
    <tr key={admin._id} className="border-t border-gray-100">
  <td className="px-4 py-3">{admin.name}</td>
  <td className="px-4 py-3">{admin.email}</td>
  <td className="px-4 py-3">
    {new Date(admin.createdAt).toLocaleDateString()}
  </td>
  <td className="px-4 py-3">
    <button
      onClick={() => handleDelete(admin._id)}
      className="text-red-500 hover:underline text-sm" 
    >
     <RiDeleteBin6Line />
    </button>
  </td>
</tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create admin form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-72 flex-shrink-0">
            <h2 className="text-base font-semibold text-center mb-4">
              Create Admin
            </h2>

            {message && (
              <p className="text-green-600 text-sm mb-3 text-center">{message}</p>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
              >
                Create Admin
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Administrators