import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const services = [
    { name: "Haircut", price: 120, duration: 30, description: "Professional haircut with styling" },
    { name: "Beard Trim", price: 20, duration: 10, description: "Precise beard shaping and trimming" },
    { name: "Shave", price: 20, duration: 15, description: "Traditional straight razor shave" },
    { name: "Combo", price: 180, duration: 40, description: "Haircut + Beard complete grooming" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ABDEEN Barber Shop</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">ABDEEN</h1>
            <nav className="flex space-x-6">
             <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
             <Link href="/booking" className="text-gray-700 hover:text-gray-900">Book</Link>
             <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Title with scissors */}
          <div className="relative border-4 border-white p-8 mb-8">
            <div className="absolute -left-4 -top-4">
              <span className="text-2xl">✂️</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-wider">
              ABDEEN
            </h1>
            <div className="absolute -right-4 -bottom-4 transform rotate-180">
              <span className="text-2xl">✂️</span>
            </div>
            <p className="text-xl mt-4 text-gray-300">Barber Shop</p>
          </div>

          <p className="text-xl mb-8 text-gray-300">
            Premium grooming services with traditional craftsmanship
          </p>

          <Link 
            href="/booking"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-gray-900">${service.price}</div>
                <div className="text-sm text-gray-500">{service.duration} minutes</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}