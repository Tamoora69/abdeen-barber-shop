import Head from 'next/head'
import Link from 'next/link'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Contact - Abdeen Barber Shop Ismailia</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ABDEEN
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link href="/booking" className="text-gray-700 hover:text-gray-900 font-medium">Book</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Contact Us
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Get In Touch
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Address</h3>
                      <p className="text-gray-600">
                        Shebeen El-Kom Street<br />
                        Ismailia, Egypt
                      </p>
                      <a 
                        href="https://maps.app.goo.gl/cHBvaa89G91m82G5A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Phone</h3>
                      <a 
                        href="tel:+201206310046"
                        className="text-2xl font-bold text-gray-900 hover:text-gray-700"
                      >
                        +20 120 631 0046
                      </a>
                      <p className="text-gray-600 text-sm mt-1">
                        Call us for appointments or inquiries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Business Hours</h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Monday - Thursday:</span>
                          <span className="font-medium">11:00 AM - 1:00 AM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Friday - Saturday:</span>
                          <span className="font-medium">11:00 AM - 2:00 AM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday:</span>
                          <span className="font-medium">11:00 AM - 12:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <a
                    href="https://wa.me/201206310046"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition-all"
                  >
                    <span className="mr-3">💬</span>
                    Message us on WhatsApp
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Location
                </h2>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-64 bg-gray-800">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-4">🗺️</div>
                      <p className="text-xl font-bold mb-2">Shebeen El-Kom Street</p>
                      <p className="text-gray-300">Ismailia, Egypt</p>
                      <a 
                        href="https://maps.app.goo.gl/cHBvaa89G91m82G5A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                      >
                        Open Google Maps
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4 text-center">
                  Find us easily on Shebeen El-Kom Street in Ismailia
                </p>
              </div>
            </div>

            {/* Quick Booking & Info */}
            <div className="space-y-8">
              <div className="bg-gray-900 text-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Quick Booking
                </h2>
                <p className="text-gray-300 mb-8">
                  Book your appointment online in just a few clicks
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-white/10 rounded-lg">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span>1</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Choose Service</h4>
                      <p className="text-gray-400 text-sm">Haircut, Trimming, Shave, or Combo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-white/10 rounded-lg">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span>2</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Select Date & Time</h4>
                      <p className="text-gray-400 text-sm">Pick from available slots</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-white/10 rounded-lg">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span>3</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Confirm Details</h4>
                      <p className="text-gray-400 text-sm">Enter your information</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/booking"
                  className="mt-8 block w-full bg-white text-gray-900 py-4 px-6 rounded-lg font-bold text-lg text-center hover:bg-gray-100 transition-all"
                >
                  Book Appointment Now
                </Link>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Do I need to book in advance?
                    </h3>
                    <p className="text-gray-600">
                      Booking in advance is recommended to secure your preferred time slot, but walk-ins are also welcome based on availability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-gray-600">
                      We accept cash and mobile payments. All prices are in Egyptian Pounds (EGP).
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Can I cancel or reschedule my appointment?
                    </h3>
                    <p className="text-gray-600">
                      Yes, please call us at least 2 hours before your appointment to cancel or reschedule.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Do you offer any discounts?
                    </h3>
                    <p className="text-gray-600">
                      Regular customers enjoy special offers. Ask about our loyalty program when you visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              <span className="mr-2">←</span>
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}