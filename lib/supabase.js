import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Add debug logging
console.log('🔧 Supabase Config Loaded:', { 
  url: supabaseUrl,
  key: supabaseKey ? '✅ Present' : '❌ Missing'
})

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})