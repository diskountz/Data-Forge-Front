// File: components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';  // Add this import

export default function Header() {
  return (
    <header className="bg-white shadow-md pt-4"> {/* Added pt-4 for top padding */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <a className="flex items-center">
                <Image
                  src="/logo.png" // Place your logo in the public folder
                  alt="Data Forge"
                  width={150} // Adjust based on your logo's dimensions
                  height={45} // Adjust based on your logo's dimensions
                  className="w-auto h-auto"
                  priority // This ensures the logo loads first
                />
              </a>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/features">
              <a className="text-napoleon hover:text-emerald-pool transition duration-300">Features</a>
            </Link>
            <Link href="/blog">
              <a className="text-napoleon hover:text-emerald-pool transition duration-300">Blog</a>
            </Link>
            <Link href="/pricing">
              <a className="text-napoleon hover:text-emerald-pool transition duration-300">Pricing</a>
            </Link>
            <Link href="/testimonials">
              <a className="text-napoleon hover:text-emerald-pool transition duration-300">Testimonials</a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = 'https://app.dataforge.so'}
              className="text-napoleon hover:text-emerald-pool transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => window.location.href = 'https://app.dataforge.so'}
              className="bg-emerald-pool text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
