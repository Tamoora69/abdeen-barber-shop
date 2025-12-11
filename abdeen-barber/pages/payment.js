import { useRouter } from 'next/router'

export default function Payment() {
  const router = useRouter()

  const confirmBooking = () => {
    // In a real app, you would save to database here
    alert('Booking confirmed! Please pay at the shop when you arrive.')
    router.push('/') // Go back to home page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Your appointment has been scheduled
          </p>

          {/* Confirmation Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Your appointment is now reserved</li>
              <li>Please arrive 5 minutes early</li>
              <li>Payment is due at the shop when you arrive</li>
              <li>Bring your phone for confirmation</li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Shop Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Address:</strong> 123 Barber Street, City, State 12345</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Payment:</strong> Cash or card accepted at the shop</p>
            </div>
          </div>

          {/* Confirmation Button */}
          <button
            onClick={confirmBooking}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800"
          >
            Got it! Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}