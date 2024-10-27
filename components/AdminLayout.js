// File: components/AdminLayout.js
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'
import { LayoutDashboard, FileText, FolderTree, Wand2, LogOut, Settings } from 'lucide-react'

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

  const navigationItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      matches: (path) => path === '/admin'
    },
    {
      href: '/admin/posts',
      label: 'Posts',
      icon: FileText,
      matches: (path) => path.startsWith('/admin/posts') && !path.includes('ai-generator')
    },
    {
      href: '/admin/posts/ai-generator',
      label: 'AI Writer',
      icon: Wand2,
      matches: (path) => path === '/admin/posts/ai-generator'
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: FolderTree,
      matches: (path) => path.startsWith('/admin/categories')
    },
    {
      href: '/admin/settings/content',
      label: 'Settings',
      icon: Settings,
      matches: (path) => path.startsWith('/admin/settings')
    }
  ]

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
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        item.matches(router.pathname)
                          ? 'border-emerald-pool text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      } cursor-pointer group transition-colors duration-150`}
                    >
                      <item.icon
                        className={`mr-2 h-4 w-4 ${
                          item.matches(router.pathname)
                            ? 'text-emerald-pool'
                            : 'text-gray-400 group-hover:text-gray-500'
                        } transition-colors duration-150`}
                      />
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-pool hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool transition-colors duration-150"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`${
                  item.matches(router.pathname)
                    ? 'bg-emerald-pool text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors duration-150`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    item.matches(router.pathname)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } transition-colors duration-150`}
                />
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

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