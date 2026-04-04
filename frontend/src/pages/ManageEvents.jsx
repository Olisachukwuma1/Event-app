import { useState, useEffect  } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import EventTable from '../components/EventTable'
import Sidebar from '../components/Sidebar'
import getUser from '../utils/getUser'

function ManageEvents() {
  const user = getUser()
  const [events, setEvents] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

 useEffect(() => {
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: 'Bearer ' + token },
      })
      setEvents(res.data)
    } catch (_err) {
      console.error(_err)
      setMessage('Failed to load events')
    }
  }


    fetchEvents()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete('http://localhost:5000/api/events/' + id, {
        headers: { Authorization: 'Bearer ' + token },
      })
      setMessage('Event deleted successfully')

        const res = await axios.get('http://localhost:5000/api/events', {
      headers: { Authorization: 'Bearer ' + token },
    })
    setEvents(res.data)
    
    } catch (_err) {
      console.error(_err)
      setMessage('Failed to delete event')
    }
  }
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Manage Event</h1>
<span className="text-sm text-blue-600">Welcome, {user?.name || 'Admin'}</span>
        </div>

        {message && (
          <p className="text-green-600 text-sm mb-3">{message}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            Total Records: {events.length}
          </span>
          <button
            onClick={() => navigate('/events/add_event')}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            + Add Event
          </button>
        </div>
<EventTable events={events} onDelete={handleDelete} />
       

      </div>
    </div>
  )
}

export default ManageEvents