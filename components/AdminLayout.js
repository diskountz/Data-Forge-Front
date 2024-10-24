// File: components/AdminLayout.js
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AdminLayout({ children }) {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin">
                  <span className="text-2xl font-bold text-emerald-pool cursor-pointer">
                    Data Forge CMS
                  </span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin">
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname === '/admin' 
                      ? 'border-emerald-pool text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/admin/posts">
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname.startsWith('/admin/posts')
                      ? 'border-emerald-pool text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}>
                    Posts
                  </span>
                </Link>
                <Link href="/admin/categories">
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname.startsWith('/admin/categories')
                      ? 'border-emerald-pool text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}>
                    Categories
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-pool hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}