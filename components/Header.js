// File: components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md pt-4">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Data Forge"
                width={150}
                height={45}
                className="w-auto h-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/features" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Features
            </Link>
            <Link href="/blog" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Blog
            </Link>
            <Link href="/pricing" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Pricing
            </Link>
            <Link href="/testimonials" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Testimonials
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              href="https://app.dataforge.so"
              className="text-napoleon hover:text-emerald-pool transition duration-300"
            >
              Login
            </Link>
            <button
              onClick={() => window.location.href = 'https://app.dataforge.so'}
              className="bg-emerald-pool text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              href="https://app.dataforge.so"
              className="text-napoleon hover:text-emerald-pool transition duration-300"
            >
              Login
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-napoleon hover:bg-gray-100 transition duration-300"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 mt-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/features" 
                className="block px-3 py-2 rounded-md text-base font-medium text-napoleon hover:text-emerald-pool hover:bg-gray-50"
              >
                Features
              </Link>
              <Link 
                href="/blog" 
                className="block px-3 py-2 rounded-md text-base font-medium text-napoleon hover:text-emerald-pool hover:bg-gray-50"
              >
                Blog
              </Link>
              <Link 
                href="/pricing" 
                className="block px-3 py-2 rounded-md text-base font-medium text-napoleon hover:text-emerald-pool hover:bg-gray-50"
              >
                Pricing
              </Link>
              <Link 
                href="/testimonials" 
                className="block px-3 py-2 rounded-md text-base font-medium text-napoleon hover:text-emerald-pool hover:bg-gray-50"
              >
                Testimonials
              </Link>
              <button
                onClick={() => window.location.href = 'https://app.dataforge.so'}
                className="w-full text-left px-3 py-2 bg-emerald-pool text-white rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}