✂️ Abdeen Barber Shop – Online Booking System

A complete, full-stack barber shop booking system built for real business use.
Designed for speed, simplicity, and real-time performance, this project allows customers to book appointments seamlessly while the shop manages availability instantly.

🚀 Live Demo

👉 https://abdeen-barber-shop.vercel.app

✨ Features
🎯 Core User Features

Real-time appointment booking with dynamic slot availability

4-step booking workflow (Service → Date → Time → Info)

Egyptian Phone Validation (strict 11-digit + starts with 01)

Instant Toast Notifications for success/errors

Fully Responsive on phone, tablet, and desktop

🛠️ Business Features

Service list

Haircut – 120 EGP

Trimming – 20 EGP

Full Shave – 20 EGP

Combo – 140 EGP

Working Hours: 11:00 AM → 1:00 AM

Weekend Flagging: Thursday & Friday

Google Maps Location Integration

🔒 Technical Features

Supabase PostgreSQL Database

Real-time updates via Supabase channels

Server-side + client-side validation

Next.js performance optimizations

Clean reusable components

🏗️ Project Structure
abdeen-barber-shop/
│
├── pages/
│   ├── index.js          # Home page
│   ├── booking.js        # Booking system
│   ├── contact.js        # Contact page
│   ├── payment.js        # Booking confirmation
│   └── _app.js           # App wrapper (global styles + Toast)
│
├── components/           # UI components
├── lib/
│   └── supabase.js       # Supabase client
│
├── styles/
│   └── globals.css
│
├── public/               # Images & static assets
└── config files          # Tailwind, PostCSS, etc.

🛠️ Tech Stack
Frontend

Next.js 14

React 18

Tailwind CSS

React Toastify

Backend / Database

Supabase

PostgreSQL

Deployment

Vercel (CI/CD + hosting)

Environment variables for secure config

🚀 Getting Started
1. Prerequisites

Node.js 18+

npm or yarn

Git

2. Installation
# Clone repo
git clone https://github.com/Tamoora69/abdeen-barber-shop.git

cd abdeen-barber-shop

# Install dependencies
npm install

3. Environment Variables

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

4. Run development server
npm run dev

📖 How It Works
1. Database Schema
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);

2. Booking Flow

Choose service

Pick date (Thu/Fri marked as weekend)

Choose available time (real-time)

Enter name + validated phone

Confirm with instant toast

3. Real-time Updates
useEffect(() => {
  const channel = supabase
    .channel('realtime-appointments')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'appointments' },
      (payload) => {
        setAvailableSlots(prev =>
          prev.filter(slot => slot !== bookedTime)
        )
      }
    )
    .subscribe()
}, [])

Egyptian Phone Validation
const validateEgyptianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 11 && cleaned.startsWith('01')
}

📊 Database Management

In Supabase you can:

View all bookings

Export CSV

Monitor usage & logs

Manage backups

🎯 Challenges & Solutions
Challenge	Solution
Real-time slot updates	Supabase real-time channels
Egyptian phone validation	Custom regex & sanitization
Double booking risk	Database constraints + UI checks
Mobile responsiveness	Tailwind CSS breakpoints
Time zone differences	UTC storage + local display
🤝 Contributing

Suggestions are welcome:

Fork repo

Create feature branch

Commit changes

Open a pull request

📞 Contact & Business Info
Barber Shop

📍 Shebeen El-Kom Street, Ismailia, Egypt
📞 +20 120 631 0046
🕒 11:00 AM – 1:00 AM (Daily)

Developer – Adham Tamer

🌐 Portfolio: https://tamoora69.github.io/adham-portfolio/

💼 LinkedIn: https://www.linkedin.com/in/adhamtamer/

🐙 GitHub: https://github.com/Tamoora69

📧 Email: adhamt864@gmail.com

📄 License

This project is proprietary and belongs to Abdeen Barber Shop – Ismailia, Egypt.

⭐ Support

If you like this project, please ⭐ star the repo — it helps a lot!

Built with passion in Ismailia, Egypt 🇪🇬
