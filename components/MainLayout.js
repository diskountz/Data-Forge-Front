// File: components/MainLayout.js
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Added a top margin to create space between the top bar and the header */}
      <nav className="bg-white border-b mt-4"> {/* Adjust mt-4 as needed */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-daring-indigo cursor-pointer flex items-center">
                  <img
                    className="h-8 w-auto mr-2"
                    src="/logo.svg"
                    alt="Data Forge"
                  />
                  Data Forge
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="#features">
                  <span className="text-napoleon hover:text-emerald-pool transition duration-300 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Features
                  </span>
                </Link>
                <Link href="/blog">
                  <span className="text-napoleon hover:text-emerald-pool transition duration-300 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Blog
                  </span>
                </Link>
                <Link href="/pricing">
                  <span className="text-napoleon hover:text-emerald-pool transition duration-300 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Pricing
                  </span>
                </Link>
                <Link href="#testimonials">
                  <span className="text-napoleon hover:text-emerald-pool transition duration-300 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-emerald-pool">
                    Testimonials
                  </span>
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <Link href="/auth/signin">
                <span className="text-napoleon hover:text-emerald-pool transition duration-300 px-3 py-2 cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/auth/signup">
                <span className="bg-emerald-pool text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300 cursor-pointer">
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
