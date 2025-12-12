import { supabase } from '../lib/supabase'

export default function SupabaseDebug() {
  const checkUrl = () => {
    console.log("🧪 Actual Supabase URL check:")
    console.log("From supabase client:", supabase?.supabaseUrl)
    console.log("From env:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Test the actual connection
    supabase.from('appointments').select('id').limit(1)
      .then(result => {
        console.log("Connection test result:", result.error ? "❌ " + result.error.message : "✅ Connected")
        alert(result.error ? "Error: " + result.error.message : "Connected to: " + supabase.supabaseUrl)
      })
  }
  
  return (
    <div style={{padding: 20}}>
      <h1>Supabase Debug Page</h1>
      <button onClick={checkUrl} style={{padding: 10, background: 'blue', color: 'white'}}>
        Check Supabase URL
      </button>
      <div style={{marginTop: 20, background: '#f0f0f0', padding: 10}}>
        <h3>Debug Info:</h3>
        <p>Environment URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Not loaded"}</p>
        <p>Client URL: {supabase?.supabaseUrl || "❌ Not loaded"}</p>
      </div>
    </div>
  )
}
