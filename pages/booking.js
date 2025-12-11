import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { toast } from 'react-toastify'

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
  const [isCheckingTimes, setIsCheckingTimes] = useState(false)

  const services = [
    { id: 'haircut', name: 'Haircut', duration: 30, price: 120 },
    { id: 'trimming', name: 'Trimming', duration: 5, price: 20 },
    { id: 'fullshave', name: 'Full Shave', duration: 10, price: 20 },
    { id: 'combo', name: 'Combo', duration: 40, price: 140 }
  ]

  // Helper function to convert 24h to AM/PM
  const formatTimeAMPM = (time24) => {
    if (!time24) return ''
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Fetch already booked times for a date
  const fetchBookedTimes = async (dateString) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', dateString)

    if (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Error checking available times')
      return []
    }
    
    return data.map(apt => apt.appointment_time.substring(0, 5))
  }

  // Real-time listener for new appointments
  useEffect(() => {
    if (!formData.date) return

    const channel = supabase
      .channel(`realtime-${formData.date}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `appointment_date=eq.${formData.date}`
        },
        (payload) => {
          const bookedTime = payload.new.appointment_time.substring(0, 5)
          
          // Remove the booked time from available slots
          setAvailableSlots(prev => prev.filter(slot => slot !== bookedTime))
          
          // Show subtle notification
          if (formData.time === bookedTime) {
            toast.warning('The time you selected was just booked. Please choose another.', {
              autoClose: 5000,
              position: 'top-center'
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [formData.date, formData.time])

  const handleServiceSelect = (serviceId) => {
    setFormData({...formData, service: serviceId})
    setStep(2)
    toast.success('Service selected! Choose a date.')
  }

  // Function to check if date is Thursday or Friday (Weekend)
  const isWeekend = (date) => {
    const day = date.getDay()
    return day === 4 || day === 5 // Thursday = 4, Friday = 5
  }

  const handleDateSelect = async (date) => {
    const dateString = date.toISOString().split('T')[0]
    setSelectedDate(date)
    setFormData({...formData, date: dateString})
    
    setIsCheckingTimes(true)
    toast.info('Loading available times...', { autoClose: 1500 })
    
    // Get already booked times for this date
    const bookedTimes = await fetchBookedTimes(dateString)
    
    // Generate all possible time slots (11 AM to 1 AM next day, 30-minute intervals)
    const allSlots = []
    // 11 AM to 11:30 PM
    for (let hour = 11; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        allSlots.push(timeString)
      }
    }
    // 12 AM to 1 AM (next day)
    for (let hour = 0; hour < 1; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        allSlots.push(timeString)
      }
    }
    
    // Filter out already booked times
    const available = allSlots.filter(slot => !bookedTimes.includes(slot))
    setAvailableSlots(available)
    
    setIsCheckingTimes(false)
    
    if (available.length === 0) {
      toast.error('No available slots for this date. Please choose another.')
    } else {
      toast.success(`${available.length} time slots available!`)
      setStep(3)
    }
  }

  const handleTimeSelect = (time) => {
    setFormData({...formData, time})
    toast.success(`Time selected: ${formatTimeAMPM(time)}`, { autoClose: 1500 })
    setStep(4)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    // Validate phone number (must be 11 digits for Egypt)
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    
    // Remove any spaces or special characters
    const cleanedPhone = formData.phone.replace(/\D/g, '')
    
    // Check if phone number is valid Egyptian number (11 digits starting with 01)
    if (cleanedPhone.length !== 11 || !cleanedPhone.startsWith('01')) {
      toast.error('Please enter a valid Egyptian phone number (11 digits starting with 01)')
      return
    }
    
    if (!formData.service || !formData.date || !formData.time) {
      toast.error('Please complete all booking steps')
      return
    }

    setLoading(true)
    toast.info('Securing your time slot...', { autoClose: 2000 })

    try {
      // Double-check if slot is still available
      const bookedTimes = await fetchBookedTimes(formData.date)
      if (bookedTimes.includes(formData.time)) {
        toast.error('Sorry, this time was just booked. Please choose another.', {
          autoClose: 5000
        })
        setStep(3)
        setLoading(false)
        return
      }

      // Save to database WITHOUT barber_preference column
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          customer_name: formData.name,
          customer_phone: formData.phone,
          service_id: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time + ':00',
          status: 'confirmed'
        }])
        .select()

      if (error) {
        toast.error('Error: ' + error.message)
        throw error
      }

      // Show success
      const serviceName = services.find(s => s.id === formData.service)?.name
      
      toast.success(
        <div>
          <div className="font-bold text-lg">✅ Booking Confirmed!</div>
          <div className="mt-2 text-sm">
            <p><strong>Service:</strong> {serviceName}</p>
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Time:</strong> {formatTimeAMPM(formData.time)}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p className="mt-2 text-green-700">We'll contact you for confirmation!</p>
          </div>
        </div>,
        {
          autoClose: 7000,
          position: 'top-center'
        }
      )
      
      // Wait then redirect
      setTimeout(() => {
        router.push('/')
      }, 3000)
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('Booking failed. Please try again or call us.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Book Your Appointment
            </h1>
            <p className="text-gray-600">
              {step === 1 && 'Choose your service'}
              {step === 2 && 'Select a date'}
              {step === 3 && 'Pick a time'}
              {step === 4 && 'Your information'}
            </p>
          </div>

          {/* Progress Steps - Now 4 steps (removed barber step) */}
          <div className="flex justify-between mb-10">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= stepNumber 
                    ? 'bg-gray-900 text-white scale-110' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                <span className="text-xs mt-2 text-gray-600">
                  {stepNumber === 1 && 'Service'}
                  {stepNumber === 2 && 'Date'}
                  {stepNumber === 3 && 'Time'}
                  {stepNumber === 4 && 'Details'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6">Choose Your Service</h2>
              <div className="grid gap-4">
                {services.map(service => (
                  <div
                    key={service.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      formData.service === service.id
                        ? 'border-gray-900 bg-gray-50 transform scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                        <p className="text-gray-600">{service.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{service.price} EGP</div>
                        {formData.service === service.id && (
                          <div className="text-green-600 text-sm">✓ Selected</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selection - Thursday & Friday marked as Weekend */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6">Select Date</h2>
              <div className="grid gap-3">
                {[0, 1, 2, 3, 4, 5, 6].map(days => {
                  const date = new Date()
                  date.setDate(date.getDate() + days)
                  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                  const dayName = dayNames[date.getDay()]
                  const isWeekendDay = dayName === 'Thursday' || dayName === 'Friday'
                  
                  return (
                    <div
                      key={days}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        formData.date === date.toISOString().split('T')[0]
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {dayName}
                          </h3>
                          <p className="text-gray-600">
                            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        {isWeekendDay && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Weekend
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6">Choose Time Slot</h2>
              
              {selectedDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-blue-600 text-sm">Hours: 11:00 AM - 1:00 AM</p>
                </div>
              )}
              
              {isCheckingTimes ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Checking real-time availability...</p>
                  <p className="text-gray-500 text-sm mt-2">Preventing double bookings</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          formData.time === slot
                            ? 'bg-gray-900 text-white transform scale-105 shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div className="font-bold">{formatTimeAMPM(slot)}</div>
                        <div className="text-xs opacity-75">Available</div>
                      </button>
                    ))}
                  </div>
                  
                  {availableSlots.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="text-4xl mb-4">😕</div>
                      <p className="text-gray-700 font-medium mb-2">No available slots</p>
                      <p className="text-gray-600 mb-4">This date is fully booked. Try another day.</p>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-gray-700 hover:text-gray-900 font-medium underline"
                      >
                        ← Choose another date
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 4: Customer Information */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6">Your Details</h2>
              
              {/* Appointment Summary Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Appointment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{services.find(s => s.id === formData.service)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTimeAMPM(formData.time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{services.find(s => s.id === formData.service)?.price} EGP</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                  {!formData.name && (
                    <p className="text-red-500 text-xs mt-2">Name is required</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Egyptian Phone Number *
                    <span className="text-gray-500 text-xs ml-2">(11 digits starting with 01)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="01X XXXXXXX"
                    pattern="01[0-9]{9}"
                    maxLength="11"
                  />
                  {formData.phone && (
                    <p className={`text-xs mt-2 ${
                      formData.phone.replace(/\D/g, '').length === 11 && formData.phone.startsWith('01') 
                        ? 'text-green-600' 
                        : 'text-red-500'
                    }`}>
                      {formData.phone.replace(/\D/g, '').length === 11 && formData.phone.startsWith('01') 
                        ? '✓ Valid Egyptian number' 
                        : 'Please enter 11 digits starting with 01'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.phone || formData.phone.replace(/\D/g, '').length !== 11}
                  className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition-all ${
                    !formData.name || !formData.phone || formData.phone.replace(/\D/g, '').length !== 11 || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Securing Your Booking...
                    </div>
                  ) : (
                    'Confirm & Book Now'
                  )}
                </button>

                {(!formData.name || !formData.phone) && (
                  <p className="text-red-500 text-sm text-center">
                    * Please fill in all required fields
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