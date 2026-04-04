import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Administrators from './pages/Administrators'
import AuthCode from './pages/AuthCode'
import ManageEvents from './pages/ManageEvents'
import AddEvent from './pages/AddEvent'
import FrontendEvents from './pages/FrontendEvents'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
         <Route path="/" element={<Login />} />
        <Route path="/authentication_code" element={<ProtectedRoute><AuthCode /></ProtectedRoute>} />
        <Route path="/administrators" element={<ProtectedRoute><Administrators /></ProtectedRoute>} />
        <Route path="/events/frontend" element={<FrontendEvents />} />
        <Route path="/events/manage_events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
        <Route path="/events/add_event" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App