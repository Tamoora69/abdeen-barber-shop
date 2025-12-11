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
    return data.map(apt => apt.appointment_time