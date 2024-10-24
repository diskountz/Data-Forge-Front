// File: pages/_app.js
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import '../styles/globals.css'

// For older versions of Next.js without built-in font support
// Add this to your _document.js instead:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <div className="font-sans">
        <Component {...pageProps} />
      </div>
    </SessionContextProvider>
  )
}

export default MyApp