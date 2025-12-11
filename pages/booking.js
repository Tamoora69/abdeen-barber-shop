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
    { id: 'haircut', name: "شعر", price: 120, duration: 30, description: "Professional haircut with modern styling", icon: "💇" },
    { id: 'trimming', name: "تدريج", price: 100, duration: 15, description: "Hair trimming", icon: "🧔" },
    { id: 'trimming_beard', name: "تدريج + دقن", price: 120, duration: 20, description: "Traditional straight razor shave", icon: "✨" },
    { id: 'beard', name: "دقن", price: 50, duration: 10, description: "Beard complete grooming", icon: "✨" },
    { id: 'styling', name: "استشوار", price: 50, duration: 15, description: "modern styling", icon: "✨" },
    { id: 'combo', name: "حلاقه + دقن + استشوار", price: 150, duration: 40, description: "Haircut + modern styling + Beard complete grooming", icon: "✨" }
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
          setAvailableSlots(prev => prev.filter(slot => slot !== bookedTime))
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
    
    const bookedTimes = await fetchBookedTimes(dateString)
    
    const allSlots = []
    for (let hour = 11; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        allSlots.push(timeString)
      }
    }
    for (let hour = 0; hour < 1; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        allSlots.push(timeString)
      }
    }
    
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
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    
    const cleanedPhone = formData.phone.replace(/\D/g, '')
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
      const bookedTimes = await fetchBookedTimes(formData.date)
      if (bookedTimes.includes(formData.time)) {
        toast.error('Sorry, this time was just booked. Please choose another.', {
          autoClose: 5000
        })
        setStep(3)
        setLoading(false)
        return
      }

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
        { autoClose: 7000, position: 'top-center' }
      )
      
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
      {/* ... Your JSX here (same as your original code) */}
    </div>
  )
}
