import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [scissorRotate, setScissorRotate] = useState(false)
  const [stats, setStats] = useState({ clients: 0, experience: 0, rating: 0 })
  
  useEffect(() => {
    // Animate scissors on page load
    setTimeout(() => setScissorRotate(true), 500)
    
    // Animate stats counter
    setTimeout(() => {
      const interval = setInterval(() => {
        setStats(prev => ({
          clients: prev.clients < 500 ? prev.clients + 25 : 500,
          experience: prev.experience < 15 ? prev.experience + 1 : 15,
          rating: prev.rating < 4.9 ? prev.rating + 0.1 : 4.9
        }))
      }, 30)
      
      setTimeout(() => clearInterval(interval), 2000)
    }, 1000)
  }, [])

  const services = [
    { 
      name: "Haircut", 
      price: 25, 
      duration: 30, 
      description: "Professional haircut with modern styling",
      icon: "💇"
    },
    { 
      name: "Beard Trim", 
      price: 15, 
      duration: 20, 
      description: "Precise beard shaping and trimming",
      icon: "🧔"
    },
    { 
      name: "Shave", 
      price: 20, 
      duration: 25, 
      description: "Traditional straight razor shave",
      icon: "🪒"
    },
    { 
      name: "Combo", 
      price: 35, 
      duration: 45, 
      description: "Haircut + Beard complete grooming",
      icon: "✨"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Abdeen Barber Shop - Premium Grooming in Shebeen El-Kom</title>
        <meta name="description" content="Professional barber services at Abdeen Barber Shop in Shebeen El-Kom. Haircut, beard trim, shave, and grooming services." />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Animated Title with Scissors */}
          <div className={`relative inline-block transition-transform duration-1000 ${scissorRotate ? 'scale-110' : 'scale-100'}`}>
            <div className="absolute -left-12 -top-8">
              <div className={`text-4xl transition-all duration-1000 ${scissorRotate ? 'rotate-45' : 'rotate-0'}`}>
                ✂️
              </div>
            </div>
            
            <div className="border-4 border-white/80 border-double px-12 py-10 rounded-2xl backdrop-blur-sm bg-white/5">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                ABDEEN
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4"></div>
              <p className="text-2xl md:text-3xl font-light text-gray-300">
                BARBER <span className="font-bold">SHOP</span>
              </p>
            </div>
            
            <div className="absolute -right-12 -bottom-8">
              <div className={`text-4xl transition-all duration-1000 ${scissorRotate ? '-rotate-45' : 'rotate-0'}`}>
                ✂️
              </div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mt-8 mb-10 max-w-2xl mx-auto">
            Premium grooming at <span className="font-bold text-white">Shebeen El-Kom</span> • Next to Ford's Garage
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg text-center"
            >
              Book Appointment
            </Link>
            <a 
              href="tel:+201206310046"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all text-center"
            >
              Call: +20 120 631 0046
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">{stats.clients}+</div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">{stats.experience}+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">{stats.rating.toFixed(1)}</div>
              <div className="text-gray-400">Star Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-gray-600">Services</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional grooming services with traditional craftsmanship
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Service Icon */}
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl text-white">
                    {service.icon}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${service.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.duration} min
                    </div>
                  </div>
                  <Link 
                    href="/booking"
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Book Now
                  </Link>
                </div>
                
                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Banner */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Find Us in Shebeen El-Kom
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Conveniently located next to Ford's Garage
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-300">
                      Shebeen El-Kom<br />
                      Next to Ford's Garage
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/cHBvaa89G91m82G5A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a 
                      href="tel:+201206310046"
                      className="text-2xl font-bold hover:text-gray-300"
                    >
                      +20 120 631 0046
                    </a>
                    <p className="text-gray-300 text-sm mt-1">
                      Call us for appointments or inquiries
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-2xl mr-4">🕒</span>
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-300">
                      Monday - Thursday: 11 AM - 1 AM<br />
                      Friday - Saturday: 11 AM - 2 AM<br />
                      Sunday: 11 AM - 12 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">🗺️</span>
                  <p className="text-gray-300">Google Maps Location</p>
                  <a 
                    href="https://maps.app.goo.gl/cHBvaa89G91m82G5A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
              <p className="text-gray-400 text-sm text-center">
                Click above to get directions to our shop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mohammed A.",
                text: "Best barber in Shebeen El-Kom! Always professional and the cuts are perfect every time.",
                rating: 5
              },
              {
                name: "Ahmed S.",
                text: "Great location next to Ford's Garage. Skilled barbers who pay attention to detail.",
                rating: 5
              },
              {
                name: "Omar K.",
                text: "Clean shop, friendly service, and excellent results. My go-to barber shop now.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex text-yellow-400 mb-4">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">Regular Customer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call-to-Action */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready for Your Perfect Grooming Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Book your appointment online in seconds or visit us at our Shebeen El-Kom location
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all text-lg shadow-xl"
            >
              Book Online Now
            </Link>
            
            <a 
              href="https://maps.app.goo.gl/cHBvaa89G91m82G5A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all text-lg"
            >
              Get Directions
            </a>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-800">
            <p className="text-gray-400 mb-4">Prefer to call?</p>
            <a 
              href="tel:+201206310046"
              className="text-3xl font-bold hover:text-gray-300 inline-flex items-center"
            >
              <span className="mr-3">📞</span>
              +20 120 631 0046
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ABDEEN</h3>
              <p className="text-gray-400">
                Premium barber services in Shebeen El-Kom
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/booking" className="text-gray-400 hover:text-white">Booking</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Mon-Thu: 11AM-1AM</li>
                <li>Fri-Sat: 11AM-2AM</li>
                <li>Sunday: 11AM-12AM</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Shebeen El-Kom</li>
                <li>Next to Ford's Garage</li>
                <li>📞 +20 120 631 0046</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Abdeen Barber Shop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}