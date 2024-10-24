// File: components/MainLayout.js
import Link from 'next/link'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <span className="flex-shrink-0 flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt="Data Forge"
                  />
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/services">
                  <span className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Services
                  </span>
                </Link>
                <Link href="/blog">
                  <span className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Blog
                  </span>
                </Link>
                <Link href="/resources">
                  <span className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Resources
                  </span>
                </Link>
                <Link href="/pricing">
                  <span className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Pricing
                  </span>
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <Link href="/login">
                <span className="text-gray-900 hover:text-emerald-pool px-3 py-2">
                  Login
                </span>
              </Link>
              <Link href="/getting-started">
                <span className="bg-emerald-pool text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                  Getting Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Add footer content */}
        </div>
      </footer>
    </div>
  )
}