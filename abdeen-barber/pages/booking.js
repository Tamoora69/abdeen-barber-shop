import { useState } from 'react'
import Link from 'next/link'

export default function Booking() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: ''
  })

  const services = [
    { id: 'haircut', name: 'Haircut', duration: 30, price: 120 },
    { id: 'beard', name: 'Beard Trim', duration: 10, price: 20 },
    { id: 'shave', name: 'Shave', duration: 15, price: 30 },
    { id: 'combo', name: 'Combo', duration: 45, price: 170 }
  ]

  const timeSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30','17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30']

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
                    onClick={() => {
                      setFormData({...formData, service: service.id})
                      setStep(2)
                    }}
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
                      onClick={() => {
                        setFormData({...formData, date: date.toISOString().split('T')[0]})
                        setStep(3)
                      }}
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
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => {
                      setFormData({...formData, time: slot})
                      setStep(4)
                    }}
                    className="py-2 px-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Customer Info */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Your Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Appointment Summary</h3>
                  <p>Service: {services.find(s => s.id === formData.service)?.name}</p>
                  <p>Date: {formData.date}</p>
                  <p>Time: {formData.time}</p>
                </div>

                <Link 
                  href="/payment" 
                  className="block w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 text-center"
                >
                  Confirm Booking
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
