import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { toast } from 'react-toastify'
// Add this after your imports
console.log('🔧 Booking Page - Supabase Client:', {
  url: supabase?.supabaseUrl,
  hasRealtime: !!supabase?.realtime
})

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
    console.log("📅 Fetching booked times for:", dateString)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateString)

      if (error) {
        console.error('❌ Error fetching appointments:', error)
        toast.error('Error checking available times')
        return []
      }
      
      console.log("✅ Booked times fetched:", data)
      return data.map(apt => apt.appointment_time.substring(0, 5))
    } catch (err) {
      console.error('❌ Exception in fetchBookedTimes:', err)
      return []
    }
  }

  useEffect(() => {
    if (!formData.date) return

    console.log("🔔 Setting up realtime listener for date:", formData.date)
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
          console.log("🔔 Realtime update received:", payload)
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
      console.log("🔔 Cleaning up realtime listener")
      supabase.removeChannel(channel)
    }
  }, [formData.date, formData.time])

  const handleServiceSelect = (serviceId) => {
    console.log("✅ Service selected:", serviceId)
    setFormData({...formData, service: serviceId})
    setStep(2)
    toast.success('Service selected! Choose a date.')
  }

  const isWeekend = (date) => {
    const day = date.getDay()
    return day === 4 || day === 5 // Thursday = 4, Friday = 5
  }

  const handleDateSelect = async (date) => {
    console.log("📅 Date selected:", date)
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
      console.log("✅ Available slots:", available.length)
      toast.success(`${available.length} time slots available!`)
      setStep(3)
    }
  }

  const handleTimeSelect = (time) => {
    console.log("⏰ Time selected:", time)
    setFormData({...formData, time})
    toast.success(`Time selected: ${formatTimeAMPM(time)}`, { autoClose: 1500 })
    setStep(4)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("🎯 SUBMIT CLICKED - Step 1: Form submission started")
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    
    const cleanedPhone = formData.phone.replace(/\D/g, '')
    console.log("📱 Phone validation:", { original: formData.phone, cleaned: cleanedPhone })
    
    // More flexible phone validation
    const isValidPhone = cleanedPhone.length === 11 || cleanedPhone.length === 12
    if (!isValidPhone || !cleanedPhone.startsWith('01')) {
      toast.error('Please enter a valid Egyptian phone number (11 digits starting with 01)')
      return
    }
    
    if (!formData.service || !formData.date || !formData.time) {
      toast.error('Please complete all booking steps')
      return
    }

    console.log("✅ VALIDATION PASSED - Step 2")
    console.log("Form data for insert:", {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      cleanedPhone: cleanedPhone
    })

    setLoading(true)
    toast.info('Securing your time slot...', { autoClose: 2000 })

    try {
      console.log("🔄 Checking for double booking...")
      const bookedTimes = await fetchBookedTimes(formData.date)
      if (bookedTimes.includes(formData.time)) {
        toast.error('Sorry, this time was just booked. Please choose another.', {
          autoClose: 5000
        })
        setStep(3)
        setLoading(false)
        return
      }

      console.log("🚀 Attempting Supabase insert...")
      console.log("Insert data:", {
        customer_name: formData.name,
        customer_phone: formData.phone,
        service_id: formData.service,
        appointment_date: formData.date,
        appointment_time: formData.time + ':00',
        status: 'confirmed'
      })

      // FIXED: Correct Supabase insert syntax
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          service_id: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time + ':00',
          status: 'confirmed'
        })
        .select()

      console.log("📊 Supabase response:", { data, error })

      if (error) {
        console.error('❌ Supabase error:', error)
        toast.error('Database Error: ' + error.message)
        throw error
      }

      console.log("✅ Supabase insert successful!")
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
      console.error('❌ Booking failed:', error)
      toast.error('Booking failed. Please try again or call us.')
    } finally {
      console.log("🏁 Submission process complete")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${step >= num ? 'bg-blue-600' : 'bg-gray-300'}`}>
                {num}
              </div>
              <span className="mt-2 text-sm">
                {num === 1 && 'Service'}
                {num === 2 && 'Date'}
                {num === 3 && 'Time'}
                {num === 4 && 'Details'}
              </span>
            </div>
          ))}
          <div className="absolute top-6 left-12 right-12 h-1 bg-gray-300 -z-10"></div>
          <div className={`absolute top-6 left-12 h-1 bg-blue-600 -z-10 transition-all duration-500 ${step >= 2 ? 'w-1/3' : step >= 3 ? 'w-2/3' : step >= 4 ? 'w-full' : 'w-0'}`}></div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">اختر الخدمة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-right"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{service.icon}</span>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                      <p className="text-green-600 font-bold mt-2">{service.price} EGP</p>
                      <p className="text-gray-500 text-xs">⏱️ {service.duration} دقيقة</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">اختر التاريخ</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() + i)
                const dateString = date.toISOString().split('T')[0]
                const isSelected = formData.date === dateString
                const isWeekendDay = isWeekend(date)
                
                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(date)}
                    disabled={isCheckingTimes}
                    className={`p-4 rounded-lg text-center ${isSelected ? 'bg-blue-600 text-white' : isWeekendDay ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="font-bold">{date.getDate()}</div>
                    <div className="text-xs">
                      {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][date.getDay()]}
                    </div>
                    {isWeekendDay && <div className="text-xs text-yellow-700 mt-1">عطلة</div>}
                  </button>
                )
              })}
            </div>
            {isCheckingTimes && (
              <div className="text-center mt-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">جاري التحقق من الأوقات المتاحة...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">اختر الوقت</h2>
            <p className="text-center text-gray-600 mb-4">
              التاريخ المحدد: {selectedDate?.toLocaleDateString('ar-EG')}
            </p>
            {availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-bold">لا توجد أوقات متاحة لهذا التاريخ</p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  اختر تاريخ آخر
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`p-3 rounded-lg text-center ${formData.time === slot ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {formatTimeAMPM(slot)}
                    </button>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-4"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={!formData.time}
                  >
                    التالي
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Customer Details */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">معلومات الحجز</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">تفاصيل الحجز:</h3>
              <p><span className="font-bold">الخدمة:</span> {services.find(s => s.id === formData.service)?.name}</p>
              <p><span className="font-bold">التاريخ:</span> {formData.date}</p>
              <p><span className="font-bold">الوقت:</span> {formatTimeAMPM(formData.time)}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسمك"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">رقم هاتف مصري (11 رقم يبدأ بـ 01)</p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  رجوع
                </button>
                
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.phone}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      جاري التأكيد...
                    </>
                  ) : (
                    'تأكيد الحجز'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}