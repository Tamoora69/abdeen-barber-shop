import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [appointments, setAppointments] = useState([])
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Simple password protection
  const ADMIN_PASSWORD = 'abdeen123' // Change this to your own password

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments()
    }
  }, [isAuthenticated])

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false })

    setAppointments(data || [])
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Wrong password!')
    }
  }

  // Delete appointment function
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Failed to delete appointment')
      console.error(error)
    } else {
      alert('Appointment deleted successfully')
      fetchAppointments()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white p-2 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{apt.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{apt.customer_phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{apt.service_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{apt.appointment_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{apt.appointment_time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => fetchAppointments()}
          className="mt-4 bg-gray-900 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
