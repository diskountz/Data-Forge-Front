// File: components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/features', label: 'Features' },
    { href: '/blog', label: 'Blog' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

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
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-napoleon hover:text-emerald-pool transition duration-300"
              >
                {item.label}
              </Link>
            ))}
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
          <div className="flex md:hidden items-center space-x-4">
            <Link 
              href="https://app.dataforge.so"
              className="text-napoleon hover:text-emerald-pool transition duration-300"
            >
              Login
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-napoleon hover:bg-gray-100 transition duration-300"
              aria-label="Toggle menu"
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
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/features" 
                className="block w-full px-4 py-2 text-napoleon hover:text-emerald-pool"
              >
                Features
              </Link>
              <Link 
                href="/blog" 
                className="block w-full px-4 py-2 text-napoleon hover:text-emerald-pool"
              >
                Blog
              </Link>
              <Link 
                href="/pricing" 
                className="block w-full px-4 py-2 text-napoleon hover:text-emerald-pool"
              >
                Pricing
              </Link>
              <Link 
                href="/testimonials" 
                className="block w-full px-4 py-2 text-napoleon hover:text-emerald-pool"
              >
                Testimonials
              </Link>
              <button
                onClick={() => window.location.href = 'https://app.dataforge.so'}
                className="w-full px-4 py-2 bg-emerald-pool text-white rounded-lg hover:bg-opacity-90"
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