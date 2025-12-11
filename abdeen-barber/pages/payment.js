import { useState } from 'react'

export default function Payment() {
  const [uploaded, setUploaded] = useState(false)

  const sendWhatsAppMessage = () => {
    const message = "Payment Confirmation - I have completed my Instapay payment for my barber appointment"
    const phoneNumber = "01206310046" // You'll replace this with your actual number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Pay via Instapay and upload your screenshot
          </p>

          {/* Payment Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Send payment via Instapay to: <strong>ABDEEN BARBER SHOP</strong></li>
              <li>Account Number: <strong>01206310046</strong></li>
              <li>Take a screenshot of your payment confirmation</li>
              <li>Upload the screenshot below</li>
              <li>Click the WhatsApp button to send confirmation</li>
            </ol>
          </div>

          {/* QR Code Placeholder */}
          <div className="text-center mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Scan to Pay with Instapay</h3>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <div className="w-64 h-64 bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-gray-500">QR Code Placeholder</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Scan this QR code with your banking app
            </p>
          </div>

          {/* Screenshot Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload Payment Screenshot
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={() => setUploaded(true)}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="cursor-pointer inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
              >
                Choose Screenshot
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Upload a screenshot of your payment confirmation
              </p>
            </div>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={sendWhatsAppMessage}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <span>Send Payment Confirmation on WhatsApp</span>
          </button>

          {uploaded && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm text-center">
                Thank you! Please send the confirmation via WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}