import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Booking() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: ''
  })
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const services = [
    { id: 'haircut', name: 'Haircut', duration: 30, price: 25 },
    { id: 'beard', name: 'Beard Trim', duration: 20, price: 15 },
    { id: 'shave', name: 'Shave', duration: 25, price: 20 },
    { id: 'combo', name: 'Combo', duration: 45, price: 35 }
  ]

  // Fetch already booked times for a date
  const fetchBookedTimes = async (dateString) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', dateString)

    if (error) {
      console.error('Error fetching appointments:', error)
      return []
    }
    
    // Extract just the time portion (HH:MM)
    return data.map(apt => apt.appointment_time.substring(0, 5))
  }

  const handleServiceSelect = (serviceId) => {
    setFormData({...formData, service: serviceId})
    setStep(2)
  }

  const handleDateSelect = async (date) => {
    const dateString = date.toISOString().split('T')[0]
    setSelectedDate(date)
    setFormData({...formData, date: dateString})
    
    // Get already booked times for this date
    const bookedTimes = await fetchBookedTimes(dateString)
    
    // Generate all possible time slots (11 AM to 1 AM next day, 30-minute intervals)
const allSlots = []
for (let hour = 11; hour < 24; hour++) { // 11 AM to 11:30 PM
  for (let minute = 0; minute < 60; minute += 30) {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    allSlots.push(timeString)
  }
}
// Add times for midnight to 1 AM (next day)
for (let hour = 0; hour < 1; hour++) { // 12 AM to 1 AM
  for (let minute = 0; minute < 60; minute += 30) {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    allSlots.push(timeString)
  }
}
    
    // Filter out already booked times
    const available = allSlots.filter(slot => !bookedTimes.includes(slot))
    setAvailableSlots(available)
    setStep(3)
  }

  const handleTimeSelect = (time) => {
    setFormData({...formData, time})
    setStep(4)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter your name')
      return
    }
    
    if (!formData.phone.trim()) {
      alert('Please enter your phone number')
      return
    }
    
    if (!formData.service || !formData.date || !formData.time) {
      alert('Please complete all booking steps')
      return
    }

    setLoading(true)

    try {
      // First, check if this slot is still available (prevent race condition)
      const bookedTimes = await fetchBookedTimes(formData.date)
      if (bookedTimes.includes(formData.time)) {
        alert('Sorry, this time slot was just booked by someone else. Please choose another time.')
        setStep(3) // Go back to time selection
        setLoading(false)
        return
      }

      // Save to database
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          customer_name: formData.name,
          customer_phone: formData.phone,
          service_id: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time + ':00', // Add seconds for database
          status: 'confirmed'
        }])
        .select()

      if (error) throw error

      // Show confirmation and redirect
      alert(`✅ Appointment confirmed!\n\n${formData.name}, your ${services.find(s => s.id === formData.service)?.name} is booked for ${formData.date} at ${formData.time}`)
      router.push('/')
      
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Error creating appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Book Your Appointment
          </h1>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 ${step > stepNumber ? 'bg-gray-900' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Choose a Service</h2>
              <div className="grid gap-4">
                {services.map(service => (
                  <div
                    key={service.id}
                    className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600">${service.price} • {service.duration} min</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Choose a Date</h2>
              <div className="space-y-4">
                {[0, 1, 2, 3, 4, 5, 6].map(days => {
                  const date = new Date()
                  date.setDate(date.getDate() + days)
                  return (
                    <div
                      key={days}
                      className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400"
                      onClick={() => handleDateSelect(date)}
                    >
                      <h3 className="font-semibold text-gray-900">
                        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Choose a Time</h2>
              
              {selectedDate && (
                <p className="text-sm text-gray-600 mb-4">
                  Available times for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
              
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleTimeSelect(slot)}
                    className={`py-2 px-3 rounded text-sm font-medium ${
                      formData.time === slot
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
                
                {availableSlots.length === 0 && (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500 mb-2">No available slots for this date.</p>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-gray-700 hover:text-gray-900 underline"
                    >
                      ← Choose another date
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Customer Info */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your full name"
                  />
                  {!formData.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your phone number"
                  />
                  {!formData.phone && <p className="text-red-500 text-xs mt-1">Phone number is required</p>}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Appointment Summary</h3>
                  <p><strong>Service:</strong> {services.find(s => s.id === formData.service)?.name}</p>
                  <p><strong>Date:</strong> {formData.date}</p>
                  <p><strong>Time:</strong> {formData.time}</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.phone}
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    !formData.name || !formData.phone
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>

                {(!formData.name || !formData.phone) && (
                  <p className="text-red-500 text-sm text-center">
                    Please fill in all required fields (*)
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}